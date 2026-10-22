
using backend.data;
using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public static class AdminSeeder
{
    public static async Task SeedAsync(
        MongoDbContext context,
        PasswordService passwordService,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        // Never automatically seed an admin in production.
        if (!environment.IsDevelopment())
            return;

        var name = configuration["AdminSeed:Name"];
        var email = configuration["AdminSeed:Email"]?
            .Trim()
            .ToLowerInvariant();
        var password = configuration["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(name) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                "Admin seed settings are missing. Configure " +
                "AdminSeed:Name, AdminSeed:Email and AdminSeed:Password."
            );
        }

        if (password.Length < 12)
        {
            throw new InvalidOperationException(
                "The seeded admin password must contain at least 12 characters."
            );
        }

        var existingUser = await context.Users
            .Find(user => user.Email == email)
            .FirstOrDefaultAsync();

        // Never overwrite or silently promote an existing account.
        if (existingUser is not null)
        {
            Console.WriteLine(
                $"Admin seed skipped: an account already exists for {email}."
            );
            return;
        }

        var admin = new User
        {
            Name = name.Trim(),
            Email = email,
            Role = UserRole.Admin,
            IsActive = true
        };

        admin.PasswordHash = passwordService.HashPassword(
            admin,
            password
        );

        await context.Users.InsertOneAsync(admin);

        Console.WriteLine($"Development admin created: {email}");
    }
}
