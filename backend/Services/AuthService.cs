using System.Security.Cryptography.X509Certificates;
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

        await _dbcontext.Users.InsertOneAsync(user);
        return true;
    }
    public async Task<LoginResponse?> Login(LoginRequest request)
    {
        var user = await _dbcontext.Users
       .Find(user => user.Email == request.Email)
       .FirstOrDefaultAsync();

        if (user is null || !user.IsActive) return null;
        if (!_passwordService.VerifyPassword(user, request.Password, user.PasswordHash)) return null;
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

        if (storedToken is null || !storedToken.IsActive)
        {
            return null!;
        }

        var user = await _dbcontext.Users
            .Find(user => user.Id == storedToken.UserId)
            .FirstOrDefaultAsync();
        
        if (user is null) return null!;
        var now = DateTime.UtcNow;
        var revokeFilters = Builders<RefreshToken>.Filter.Eq(
            token => token.Id, storedToken.Id
        ) & Builders<RefreshToken>.Filter.Eq(
            token => token.RevokedAt, (DateTime?)null
        ) & Builders<RefreshToken>.Filter.Gt(
            token => token.ExpiresAt, now
        );
        var revokeUpdate = Builders<RefreshToken>.Update.Set(token => token.RevokedAt, now);

        var revokeResult = await _dbcontext.RefreshTokens.UpdateOneAsync(revokeFilters, revokeUpdate);
        if(revokeResult.ModifiedCount != 1) return null;
        var newAccessToken = _tokenService.GenerateToken(user);
        var newRefreshToken = _tokenService.CreateRefreshToken();

        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            TokenHash = _tokenService.HashToken(newRefreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        await _dbcontext.RefreshTokens.InsertOneAsync(newRefreshTokenEntity);

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

        var emailAlreadyUsed = await _dbcontext.Users
            .Find(existingUser => existingUser.Email == request.Email && existingUser.Id != objectId)
            .AnyAsync();

        if (emailAlreadyUsed) return false;

        var user = await _dbcontext.Users
            .Find(existingUser => existingUser.Id == objectId)
            .FirstOrDefaultAsync();

        if (user is null || !user.IsActive) return false;

        user.Name = request.Name;
        user.Email = request.Email;

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
                token => token.TokenHash,tokenHash
            ) & Builders<RefreshToken>.Filter.Eq(
                token => token.RevokedAt,(DateTime?)null
            ) & Builders<RefreshToken>.Filter.Gt(
                token => token.ExpiresAt,now
            );

        var Update = Builders<RefreshToken>.Update.Set(token => token.RevokedAt,now);
        var result = await _dbcontext.RefreshTokens.UpdateOneAsync(filters,Update);
        return true;
    }
}
