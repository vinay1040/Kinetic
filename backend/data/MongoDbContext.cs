using MongoDB.Driver;
using backend.Models;
using backend.Configuration;
using backend.Models.Orders;
namespace backend.data;

public class MongoDbContext
{
    public IMongoClient _client;
    private readonly IMongoDatabase _database;
    public MongoDbContext(MongoDbSettings settings)
    {
        _client = new MongoClient(settings.ConnectionString);
        _database = _client.GetDatabase(settings.DatabaseName);

    }
    public IMongoClient Client => _client;



    public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
    public IMongoCollection<Product> Products => _database.GetCollection<Product>("Products");
    public IMongoCollection<Inventory> Inventory => _database.GetCollection<Inventory>("Inventory");
    public IMongoCollection<RefreshToken> RefreshTokens => _database.GetCollection<RefreshToken>("RefreshTokens");
    public IMongoCollection<Cart> Cart => _database.GetCollection<Cart>("Cart");
    public IMongoCollection<Order> Order => _database.GetCollection<Order>("Order");
    public async Task EnsureIndexesAsync()
    {
        var emailIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys
                .Ascending(user => user.Email),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "Unique_User_Email"
            }
        );
        var cartUserIndex = new CreateIndexModel<Cart>(
    Builders<Cart>.IndexKeys.Ascending(cart => cart.UserId),
    new CreateIndexOptions
    {
        Unique = true,
        Name = "UserId_1"
    });

        var inventoryProductIndex = new CreateIndexModel<Inventory>(
            Builders<Inventory>.IndexKeys.Ascending(item => item.ProductId),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "Unique_Inventory_ProductId"
            });

        await Users.Indexes.CreateOneAsync(emailIndex);
        await Cart.Indexes.CreateOneAsync(cartUserIndex);
        await Inventory.Indexes.CreateOneAsync(inventoryProductIndex);
    }
}