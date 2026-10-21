
using backend.data;
using backend.Models;
using backend.Models.DTOs;
using MongoDB.Driver;
using MongoDB.Bson;

namespace backend.Services;

public class AuthService
{
    private readonly MongoDbContext _dbcontext;
    private readonly PasswordService _passwordService;
    private readonly TokenService _tokenService;


    public AuthService(MongoDbContext context, PasswordService passwordService, TokenService tokenService)
    {
        _dbcontext = context;
        _passwordService = passwordService;
        _tokenService = tokenService;

    }
    public async Task<bool> Register(RegisterRequest request)
    {
        var normalizeEmail = request.email.Trim().ToLowerInvariant();
        var existingUser = await _dbcontext.Users
            .Find(user => user.Email == normalizeEmail)
            .FirstOrDefaultAsync();
        if (existingUser is not null) return false;

        var user = new User
        {
            Name = request.name,
            Email = normalizeEmail,
            Role = UserRole.Customer,
            IsActive = true
        };
        user.PasswordHash = _passwordService.HashPassword(user, request.password);

        try
        {
            await _dbcontext.Users.InsertOneAsync(user);
            return true;
        }
        catch (MongoWriteException ex)
        when (ex.WriteError?.Category == ServerErrorCategory.DuplicateKey)
        {
            return false;
        }
    }
    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _dbcontext.Users
            .Find(user => user.Email == normalizedEmail)
            .FirstOrDefaultAsync();

        if (user is null || !user.IsActive) return null;
        if (!_passwordService.VerifyPassword(user, request.Password, user.PasswordHash)) return null;
        if (_passwordService.NeedsRehash(user, request.Password, user.PasswordHash))
        {
            var newPasswordHash = _passwordService.HashPassword(
                user,
                request.Password
            );
            var parrwordUpdate = Builders<User>.Update.Set(user => user.PasswordHash, newPasswordHash);
            await _dbcontext.Users.UpdateOneAsync(
                existingUser => existingUser.Id == user.Id,
                parrwordUpdate
            );
        }
        var token = _tokenService.GenerateToken(user);
        var refreshToken = _tokenService.CreateRefreshToken();
        var refreshTokenHash = _tokenService.HashToken(refreshToken);
        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _dbcontext.RefreshTokens.InsertOneAsync(refreshTokenEntity);

        return new LoginResponse
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            Email = user.Email,
            Role = user.Role
        };
    }
    public async Task<LoginResponse?> Refresh(RefreshRequest request)
    {
        var tokenHash = _tokenService.HashToken(request.RefreshToken);

        var storedToken = await _dbcontext.RefreshTokens
            .Find(token => token.TokenHash == tokenHash)
            .FirstOrDefaultAsync();

        if (storedToken is null)
        {
            return null;
        }

        if (!storedToken.IsActive)
        {
            // A revoked token that was replaced may indicate token reuse.
            if (storedToken.ReplacedByTokenId.HasValue)
            {
                // Revoke active refresh tokens belonging to this user.
                var revocationTime = DateTime.UtcNow;

                var activeTokensFilter = Builders<RefreshToken>.Filter.Eq(
                    token => token.UserId, storedToken.UserId
                ) & Builders<RefreshToken>.Filter.Eq(
                    token => token.RevokedAt, (DateTime?)null
                ) & Builders<RefreshToken>.Filter.Gt(
                    token => token.ExpiresAt, revocationTime
                );

                var revokeAllUpdate = Builders<RefreshToken>.Update
                    .Set(token => token.RevokedAt, revocationTime);

                await _dbcontext.RefreshTokens.UpdateManyAsync(
                    activeTokensFilter,
                    revokeAllUpdate
                );
            }

            return null;
        }

        var user = await _dbcontext.Users
            .Find(user => user.Id == storedToken.UserId)
            .FirstOrDefaultAsync();

        if (user is null || !user.IsActive)
        {
            var revokeInactiveUser = Builders<RefreshToken>.Filter.Eq(
                token => token.Id, storedToken.Id
            ) & Builders<RefreshToken>.Filter.Eq(
                token => token.RevokedAt, (DateTime?)null
            );
            var update = Builders<RefreshToken>.Update.Set(token => token.RevokedAt, DateTime.UtcNow);
            await _dbcontext.RefreshTokens.UpdateOneAsync(revokeInactiveUser, update);
            return null;
        }
        var now = DateTime.UtcNow;

        var revokeFilters = Builders<RefreshToken>.Filter.Eq(
            token => token.Id, storedToken.Id
        ) & Builders<RefreshToken>.Filter.Eq(
            token => token.RevokedAt, (DateTime?)null
        ) & Builders<RefreshToken>.Filter.Gt(
            token => token.ExpiresAt, now
        );

        var newAccessToken = _tokenService.GenerateToken(user);
        var newRefreshToken = _tokenService.CreateRefreshToken();

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = _tokenService.HashToken(newRefreshToken),
            ExpiresAt = now.AddDays(7)
        };

        // Insert the replacement first so its ID is available.
        await _dbcontext.RefreshTokens.InsertOneAsync(newRefreshTokenEntity);

        // Revoke the old token and link it to its replacement atomically.
        var revokeUpdate = Builders<RefreshToken>.Update
            .Set(token => token.RevokedAt, now)
            .Set(token => token.ReplacedByTokenId, newRefreshTokenEntity.Id);

        var revokeResult = await _dbcontext.RefreshTokens.UpdateOneAsync(
            revokeFilters,
            revokeUpdate
        );

        if (!revokeResult.IsAcknowledged || revokeResult.ModifiedCount != 1)
        {
            // The replacement must not remain usable if rotation loses the race.
            var cleanupFilter = Builders<RefreshToken>.Filter.Eq(
                token => token.Id, newRefreshTokenEntity.Id
            );

            var cleanupUpdate = Builders<RefreshToken>.Update
                .Set(token => token.RevokedAt, DateTime.UtcNow);

            await _dbcontext.RefreshTokens.UpdateOneAsync(
                cleanupFilter,
                cleanupUpdate
            );

            return null;
        }
        return new LoginResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            Email = user.Email,
            Role = user.Role
        };
    }
    public async Task<bool> UpdateUser(string id, UpdateProfileRequest request)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return false;
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailAlreadyUsed = await _dbcontext.Users
            .Find(existingUser => existingUser.Email == normalizedEmail && existingUser.Id != objectId)
            .AnyAsync();

        if (emailAlreadyUsed) return false;

        var user = await _dbcontext.Users
            .Find(existingUser => existingUser.Id == objectId)
            .FirstOrDefaultAsync();

        if (user is null || !user.IsActive) return false;

        user.Name = request.Name;
        user.Email = request.Email.Trim().ToLowerInvariant();

        var result = await _dbcontext.Users.ReplaceOneAsync(
            existingUser => existingUser.Id == objectId,
            user);

        return result.IsAcknowledged && result.MatchedCount == 1;
    }
    public async Task<bool> Logout(RefreshRequest request)
    {
        var tokenHash = _tokenService.HashToken(request.RefreshToken);
        var now = DateTime.UtcNow;
        var filters = Builders<RefreshToken>.Filter.Eq(
            token => token.TokenHash, tokenHash
        ) & Builders<RefreshToken>.Filter.Eq(
            token => token.RevokedAt, (DateTime?)null
        ) & Builders<RefreshToken>.Filter.Gt(
            token => token.ExpiresAt, now
        );

        var Update = Builders<RefreshToken>.Update.Set(token => token.RevokedAt, now);
        var result = await _dbcontext.RefreshTokens.UpdateOneAsync(filters, Update);

        return result.IsAcknowledged && result.MatchedCount == 1;
    }

    public async Task<bool> DeactivateUser(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return false;
        }

        var filter = Builders<User>.Filter.Eq(
            user => user.Id, objectId
        ) & Builders<User>.Filter.Eq(
            user => user.IsActive, true
        );

        var update = Builders<User>.Update
            .Set(user => user.IsActive, false);

        var result = await _dbcontext.Users.UpdateOneAsync(
            filter,
            update
        );

        return result.IsAcknowledged && result.MatchedCount == 1;
    }

}
