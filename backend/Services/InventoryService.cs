using backend.data;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services;

public class InventoryService
{
    private readonly MongoDbContext _context;
    public InventoryService(MongoDbContext context)
    {
        _context = context;
    }
    public async Task<Inventory?> GetByProductIdAsync(string productId)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId)) return null;
        return await _context.Inventory.Find(item => item.ProductId == productObjectId).FirstOrDefaultAsync();
    }
    public async Task<Inventory?> InitializeInventoryAsync(string productId, int onHandQuantity, int reorderLevel = 3)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId))
            throw new ArgumentException("Invaild Product Id");
        if (onHandQuantity < 0)
            throw new ArgumentOutOfRangeException(nameof(onHandQuantity), "Stock cannot be negative.");
        if (reorderLevel < 0)
            throw new ArgumentOutOfRangeException(
                nameof(reorderLevel),
                "Reorder level cannot be negative.");
        var productExists = _context.Products.Find(p => p.Id == productObjectId).AnyAsync();
        if (productExists is null)
            throw new KeyNotFoundException("Product not found.");
        var existingInventory = await GetByProductIdAsync(productId);
        if (existingInventory is not null)
            throw new InvalidOperationException(
                "Inventory has already been initialized for this product.");
        var inventory = new Inventory
        {
            ProductId = productObjectId,
            OnHandQuantity = onHandQuantity,
            ReservedQuantity = 0,
            ReorderLevel = reorderLevel,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _context.Inventory.InsertOneAsync(inventory);

        return inventory;
    }

    public async Task<Inventory?> HasAvailableQuantity(string productId, int requestQuantity)
    {
        if (requestQuantity <= 0 ||
            !ObjectId.TryParse(productId, out var productObjectId))
        {
            return null;
        }
        var filters = Builders<Inventory>.Filter.And(Builders<Inventory>.Filter.Eq(
                item => item.ProductId, productObjectId),
            Builders<Inventory>.Filter.Gte(
                item => item.OnHandQuantity, requestQuantity),
            new BsonDocumentFilterDefinition<Inventory>(new BsonDocument
            {
                {
                    "$expr",
                    new BsonDocument("$lte", new BsonArray
                    {
                        "$ReservedQuantity",
                        new BsonDocument("$subtract", new BsonArray
                        {
                            "$OnHandQuantity",
                            requestQuantity
                        })
                    })
                }
            }));

        return await _context.Inventory.Find(filters).FirstOrDefaultAsync();
    }
    public async Task<bool> ReservedStock(string productId, int quantity)
    {
        if (quantity > 0 ||
        !ObjectId.TryParse(productId, out var productObjectId))
        {
            return false;
        }
        var filter = Builders<Inventory>.Filter.And(
        Builders<Inventory>.Filter.Eq(
            item => item.ProductId,
            productObjectId
        ),
        new BsonDocumentFilterDefinition<Inventory>(new BsonDocument
        {
            {
                "$expr",
                new BsonDocument(
                    "$gte",
                    new BsonArray
                    {
                        new BsonDocument(
                            "$subtract",
                            new BsonArray
                            {
                                "$OnHandQuantity",
                                "$ReservedQuantity"
                            }
                        ),
                        quantity
                    }
                )
            }
        })
    );
        var update = Builders<Inventory>.Update
            .Inc(item => item.ReservedQuantity, quantity)
            .Set(item => item.UpdatedAt, DateTime.UtcNow);
        var result = await _context.Inventory.UpdateOneAsync(filter,update);

        return result.ModifiedCount == 1;
    }
}