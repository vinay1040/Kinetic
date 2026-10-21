using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public class PasswordService
{
    private readonly PasswordHasher<User> _passwordHasher;

    public PasswordService()
    {
        _passwordHasher = new PasswordHasher<User>();
    }

    public string HashPassword(User user, string password)
    {
        return _passwordHasher.HashPassword(user, password);
    }


    public bool VerifyPassword(
        User user,
        string password,
        string hashedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            user,
            hashedPassword,
            password
        );

        return result is PasswordVerificationResult.Success
            or PasswordVerificationResult.SuccessRehashNeeded;
    }

    public bool NeedsRehash(
        User user,
        string password,
        string hashedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(
            user,
            hashedPassword,
            password
        );

        return result == PasswordVerificationResult.SuccessRehashNeeded;
    }

}