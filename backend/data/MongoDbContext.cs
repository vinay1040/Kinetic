using MongoDB.Driver;
using backend.Models;
using backend.Configuration;
using backend.Models.Orders;
using backend.Models.Inventory;
using backend.Models.Products;
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

    public IMongoCollection<ProductVariant> ProductVariants => _database.GetCollection<ProductVariant>("ProductVariants");
    public IMongoCollection<InventoryTransaction> InventoryTransaction => _database.GetCollection<InventoryTransaction>("InventoryTransactions");
    public IMongoCollection<Warehouse> Warehouses => _database.GetCollection<Warehouse>("Warehouses");

    public IMongoCollection<Inventory> Inventory => _database.GetCollection<Inventory>("Inventory");

    public IMongoCollection<RefreshToken> RefreshTokens => _database.GetCollection<RefreshToken>("RefreshTokens");
    public IMongoCollection<Cart> Cart => _database.GetCollection<Cart>("Cart");

    public IMongoCollection<Order> Order => _database.GetCollection<Order>("Order");

    public async Task EnsureIndexesAsync()
    {
        var emailIndex = new CreateIndexModel<User>(
            Builders<User>.IndexKeys.Ascending(user => user.Email),
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
            Builders<Inventory>.IndexKeys.Ascending("productId"),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "Unique_Inventory_ProductId"
            });
        var variantSkuIndex = new CreateIndexModel<ProductVariant>(
            Builders<ProductVariant>.IndexKeys.Ascending(variant => variant.SKU),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "Unique_ProductVariant_SKU"
            });
        var warehouseCodeIndex = new CreateIndexModel<Warehouse>(
            Builders<Warehouse>.IndexKeys.Ascending(warehouse => warehouse.Code),
            new CreateIndexOptions
            {
                Unique = true,
                Name = "Unique_Warehouse_Code"
            });
        var variantProductIndex = new CreateIndexModel<ProductVariant>(
            Builders<ProductVariant>.IndexKeys
                .Ascending(variant => variant.ProductId),
            new CreateIndexOptions
            {
                Name = "ProductVariant_ProductId"
            }
        );
        var inventoryTransactionIndex =new CreateIndexModel<InventoryTransaction>(
            Builders<InventoryTransaction>.IndexKeys
                .Ascending(transaction => transaction.VariantId)
                .Ascending(transaction => transaction.WarehouseId)
                .Descending(transaction => transaction.CreatedAt),
            new CreateIndexOptions
            {
                Name = "InventoryTransaction_Variant_Warehouse_CreatedAt"
            });
        
        await Users.Indexes.CreateOneAsync(emailIndex);
        await Cart.Indexes.CreateOneAsync(cartUserIndex);
        await Inventory.Indexes.CreateOneAsync(inventoryProductIndex);
        await ProductVariants.Indexes.CreateOneAsync(variantSkuIndex);
        await ProductVariants.Indexes.CreateOneAsync(variantProductIndex);
        await Warehouses.Indexes.CreateOneAsync(warehouseCodeIndex);
        await InventoryTransaction.Indexes.CreateOneAsync(inventoryTransactionIndex);
    }
}