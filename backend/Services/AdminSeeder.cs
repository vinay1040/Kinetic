
using backend.data;
using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class AdminSeeder
{
    private readonly MongoDbContext _db;
    private readonly PasswordService _passwordService;
    private readonly IConfiguration _configuration;

    public AdminSeeder(
        MongoDbContext db,
        PasswordService passwordService,
        IConfiguration configuration)
    {
        _db = db;
        _passwordService = passwordService;
        _configuration = configuration;
    }

    public async Task SeedAsync()
    {
        var name = _configuration["AdminSeed:Name"];
        var email = _configuration["AdminSeed:Email"]?
            .Trim()
            .ToLowerInvariant();
        var password = _configuration["AdminSeed:Password"];

        if (string.IsNullOrWhiteSpace(name) ||
            string.IsNullOrWhiteSpace(email) ||
            string.IsNullOrWhiteSpace(password) ||
            password.Length < 12)
        {
            throw new InvalidOperationException(
                "AdminSeed settings are missing or the password is too short.");
        }

        var existingUser = await _db.Users
            .Find(user => user.Email == email)
            .FirstOrDefaultAsync();

        if (existingUser is not null)
        {
            if (existingUser.Role != UserRole.Admin)
            {
                throw new InvalidOperationException(
                    "The configured admin email belongs to a customer. " +
                    "Use a different email for the admin account.");
            }

            Console.WriteLine("Admin account already exists. No changes made.");
            return;
        }

        var admin = new User
        {
            Name = name,
            Email = email,
            Role = UserRole.Admin,
            IsActive = true
        };

        admin.PasswordHash = _passwordService.HashPassword(admin, password);

        await _db.Users.InsertOneAsync(admin);

        Console.WriteLine("Admin account created successfully.");
    }
}
