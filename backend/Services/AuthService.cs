using System.Security.Cryptography.X509Certificates;
using backend.data;
using backend.Models;
using backend.Models.DTOs;
using MongoDB.Driver;

namespace backend.Services;

public class AuthService
{
    private readonly MongoDbContext _dbcontext;
    private readonly PasswordService _passwordService;
    private readonly TokenService _tokenService;
    

    public AuthService(MongoDbContext context,PasswordService passwordService,TokenService tokenService)
    {
        _dbcontext = context;
        _passwordService = passwordService;
        _tokenService = tokenService;
         
    }
    public async Task<bool> Register(RegisterRequest request)
    {
        var existingUser = await _dbcontext.Users
            .Find(user => user.Email == request.email)
            .FirstOrDefaultAsync();
        if (existingUser is not null)
        {
            return false;
        }
        var user = new User
        {
            Email = request.email,
            Role = UserRole.Customer,
            IsActive = true
        };
        user.PasswordHash = _passwordService.HashPassword(user,request.password);

        await _dbcontext.Users.InsertOneAsync(user);
        return true;
    }
    public async Task<LoginResponse?> Login(LoginRequest request)
    {
         var user = await _dbcontext.Users
        .Find(user => user.Email == request.Email)
        .FirstOrDefaultAsync();

        if(user is null)
        {
            return null;
        }
        if (!_passwordService.VerifyPassword(user, request.Password,user.PasswordHash))
        {
            return null;
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
            RefreshTken = refreshToken,
            Email = user.Email,
            Role = user.Role
        };
    }
    public async Task<LoginResponse> Refresh(RefreshRequest request)
    {
        var tokenHash= _tokenService.HashToken(request.RefreshToken);

        var storedToken = await _dbcontext.RefreshTokens
            .Find(token => token.TokenHash == tokenHash)
            .FirstOrDefaultAsync();

        if(storedToken is null || !storedToken.IsActive)
        {
            return null!;
        }

        var user = await _dbcontext.Users
            .Find(user => user.Id == storedToken.UserId)
            .FirstOrDefaultAsync();
        if(user is null) return null!;
        storedToken.RevokedAt = DateTime.UtcNow;
        await _dbcontext.RefreshTokens.ReplaceOneAsync(token => token.Id == storedToken.Id,storedToken);

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
            RefreshTken = newRefreshToken,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task<bool> Logout(RefreshRequest request)
    {
        var tokenHash = _tokenService.HashToken(request.RefreshToken);

        var storedToken = await _dbcontext.RefreshTokens
            .Find(token => token.TokenHash == tokenHash)
            .FirstOrDefaultAsync();

        if(storedToken is null || !storedToken.IsActive)
        {
            return false;
        }

        storedToken.RevokedAt = DateTime.UtcNow;

        await _dbcontext.RefreshTokens.ReplaceOneAsync(token => token.Id == storedToken.Id,storedToken);
        return true;
    }
}
