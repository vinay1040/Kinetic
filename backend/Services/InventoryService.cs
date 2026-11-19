using backend.data;
using backend.Models.Inventory;
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
    public async Task<Inventory?> GetInventorybyProductIdAsync(string productId)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId)) return null;
        return await _context.Inventory.Find(item => item.ProductId == productObjectId).FirstOrDefaultAsync();
    }
    public async Task<Inventory?> InitializeInventoryAsync(string productId, int onHandQuantity, int reorderLevel = 5)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId))
            throw new ArgumentException("Invaild Product Id");
        if (onHandQuantity < 0)
            throw new ArgumentOutOfRangeException(nameof(onHandQuantity), "Stock cannot be negative.");
        if (reorderLevel < 0)
            throw new ArgumentOutOfRangeException(
                nameof(reorderLevel),
                "Reorder level cannot be negative.");
        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();
        bool committed = false;
        try
        {
            var productExists = await _context.Products.Find(p => p.Id == productObjectId).AnyAsync();
            if (!productExists)
                throw new KeyNotFoundException("Product not found.");
            var existingInventory = await GetInventorybyProductIdAsync(productId);
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
            var transaction = new InventoryTransaction
            {
                ProductId = productObjectId,
                Type = InventoryTransactionType.InitialStock,
                OnHandChange = onHandQuantity,
                ReservedChange = 0,
                OnHandAfter = onHandQuantity,
                ReservedAfter = 0,
                Reason = "Initial inventory setup",
                CreatedAt = DateTime.UtcNow
            };
            await _context.InventoryTransaction.InsertOneAsync(session, transaction);
            session.CommitTransaction();
            committed = true;
            return inventory;
        }
        finally
        {
            if (!committed && session.IsInTransaction)
                await session.AbortTransactionAsync();
        }
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

    public async Task<Inventory> ReceiveStockAsync(
        string productId,
        int quantity,
        string reason)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId))
            throw new ArgumentException("Invalid Product ID.");

        if (quantity <= 0)
            throw new ArgumentOutOfRangeException(
                nameof(quantity),
                "Received quantity must be greater than zero.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException(
                "A reason is required.",
                nameof(reason));

        using var session = await _context.Client.StartSessionAsync();

        session.StartTransaction();

        var committed = false;

        try
        {
            var filter = Builders<Inventory>.Filter
                .Eq(item => item.ProductId, productObjectId);

            var update = Builders<Inventory>.Update
                .Inc(item => item.OnHandQuantity, quantity)
                .Set(item => item.UpdatedAt, DateTime.UtcNow);

            var options = new FindOneAndUpdateOptions<Inventory>
            {
                ReturnDocument = ReturnDocument.After
            };

            var inventory = await _context.Inventory.FindOneAndUpdateAsync(
                session,
                filter,
                update,
                options);

            if (inventory is null)
                throw new KeyNotFoundException(
                    "Inventory has not been initialized for this product.");

            var transaction = new InventoryTransaction
            {
                ProductId = productObjectId,
                Type = InventoryTransactionType.StockReceived,
                OnHandChange = quantity,
                ReservedChange = 0,
                OnHandAfter = inventory.OnHandQuantity,
                ReservedAfter = inventory.ReservedQuantity,
                Reason = reason.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _context.InventoryTransaction.InsertOneAsync(
                session,
                transaction);

            await session.CommitTransactionAsync();

            committed = true;

            return inventory;
        }
        finally
        {
            if (!committed && session.IsInTransaction)
                await session.AbortTransactionAsync();
        }
    }


    public async Task<List<Inventory>> GetLowStockAsync()
    {
        var filter = new BsonDocumentFilterDefinition<Inventory>(
            BsonDocument.Parse("""
            {
                "$expr": {
                    "$lte": [
                        {
                            "$subtract": [
                                "$OnHandQuantity",
                                "$ReservedQuantity"
                            ]
                        },
                        "$ReorderLevel"
                    ]
                }
            }
            """)
        );
        return await _context.Inventory
            .Find(filter)
            .ToListAsync();
    }

    public async Task<Inventory?> AdjustStockAsync(string productId, int quantityChange, string reason)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId))
            throw new ArgumentException("Invalid Product ID.");

        if (quantityChange == 0)
            throw new ArgumentOutOfRangeException(
                nameof(quantityChange),
                "Adjustment quantity cannot be zero.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException(
                "A reason is required.",
                nameof(reason));

        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();
        bool committed = false;
        try
        {
            var filter = new BsonDocumentFilterDefinition<Inventory>(
                BsonDocument.Parse($$"""
                {
                    "ProductId": {{productObjectId.ToJson()}},
                    "$expr": {
                        "$gte": [
                            { "$add": ["$OnHandQuantity", {{quantityChange}}] },
                            "$ReservedQuantity"
                        ]
                    }
                }
                """));
            var update = Builders<Inventory>.Update.Inc((i) => i.OnHandQuantity, quantityChange).Set((i) => i.UpdatedAt, DateTime.UtcNow);
            var option = new FindOneAndUpdateOptions<Inventory> { ReturnDocument = ReturnDocument.After };
            var inventory = await _context.Inventory.FindOneAndUpdateAsync(session, filter, update, option);
            if (inventory is null)
                throw new InvalidOperationException(
                    "Inventory not found, or adjustment would reduce stock below reserved quantity.");
            var transaction = new InventoryTransaction
            {
                ProductId = productObjectId,
                Type = InventoryTransactionType.Adjustment,
                OnHandChange = quantityChange,
                ReservedChange = 0,
                OnHandAfter = inventory.OnHandQuantity,
                ReservedAfter = inventory.ReservedQuantity,
                Reason = reason.Trim(),
                CreatedAt = DateTime.UtcNow
            };
            await _context.InventoryTransaction.InsertOneAsync(session, transaction);
            session.CommitTransaction();
            committed = true;
            return inventory;
        }
        finally
        {
            if (!committed && session.IsInTransaction)
                await session.AbortTransactionAsync();
        }
    }
    public async Task<List<InventoryTransaction>> GetTransactionHistoryAsync(string productId, int pageNumber = 1, int pageSize = 20)
    {
        if (!ObjectId.TryParse(productId, out var productObjectId))
            throw new ArgumentException("Invalid Product ID.");

        if (pageNumber < 1)
            throw new ArgumentOutOfRangeException(nameof(pageNumber));

        if (pageSize < 1 || pageSize > 100)
            throw new ArgumentOutOfRangeException(
                nameof(pageSize),
                "Page size must be between 1 and 100.");

        var filter = Builders<InventoryTransaction>.Filter
            .Eq(item => item.ProductId, productObjectId);

        return await _context.InventoryTransaction
            .Find(filter)
            .SortByDescending(item => item.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Limit(pageSize)
            .ToListAsync();
    }
}