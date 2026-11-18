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

    public async Task<Inventory?> GetByVariantAsync(string variantId, string warehouseId)
    {
        if (!ObjectId.TryParse(variantId, out var variantIdObject) || !ObjectId.TryParse(warehouseId, out var warehouseObjectId))
        {
            return null;
        }
        return await _context.Inventory.Find((I) => I.VariantId == variantIdObject && I.WarehouseId == warehouseObjectId).FirstOrDefaultAsync();
    }

    public async Task<bool> CheckAvailabilityAsync(string variantId, string warehouseId, int requestedQuantity)
    {
        if (requestedQuantity <= 0 ||
       !ObjectId.TryParse(variantId, out var variantObjectId) ||
       !ObjectId.TryParse(warehouseId, out var warehouseObjectId))
        {
            return false;
        }

        var filter = Builders<Inventory>.Filter.And(
    Builders<Inventory>.Filter.Eq(
        item => item.VariantId,
        variantObjectId),

    Builders<Inventory>.Filter.Eq(
        item => item.WarehouseId,
        warehouseObjectId),

    new BsonDocumentFilterDefinition<Inventory>(
        BsonDocument.Parse(
            $$"""
            {
                "$expr": {
                    "$gte": [
                        {
                            "$subtract": [
                                "$onHandQuantity",
                                "$reservedQuantity"
                            ]
                        },
                        {{requestedQuantity}}
                    ]
                }
            }
            """))
);
        return await _context.Inventory.Find(filter).AnyAsync();
    }
    public async Task<Inventory?> InitializeAsync(string variantId, string warehouseId, int onHandQuantity, int reorderLevel = 5)
    {
        if (!ObjectId.TryParse(variantId, out var variantObjectId))
            throw new ArgumentException("Invalid variant ID.");

        if (!ObjectId.TryParse(warehouseId, out var warehouseObjectId))
            throw new ArgumentException("Invalid warehouse ID.");

        if (onHandQuantity < 0)
            throw new ArgumentOutOfRangeException(
                nameof(onHandQuantity),
                "Stock cannot be negative.");

        if (reorderLevel < 0)
            throw new ArgumentOutOfRangeException(
                nameof(reorderLevel),
                "Reorder level cannot be negative.");
        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();
        bool committed = false;
        try
        {
            var variant = await _context.ProductVariants.Find(session, (v) => v.Id == variantObjectId && v.IsActive).FirstOrDefaultAsync();
            if (variant is null)
                throw new KeyNotFoundException(
                    "Active product variant not found.");
            var warehouse = await _context.Warehouses.Find(session, (w) => w.Id == warehouseObjectId && w.IsActive).FirstOrDefaultAsync();

            if (warehouse is null)
                throw new KeyNotFoundException(
                    "Active warehouse not found.");
            var existingInventory = await _context.Inventory.Find(session, (i) => i.VariantId == variantObjectId && i.WarehouseId == warehouseObjectId).AnyAsync();

            if (existingInventory)
                throw new InvalidOperationException(
                    "Inventory is already initialized for this variant and warehouse.");
            var now = DateTime.UtcNow;
            var inventory = new Inventory
            {
                VariantId = variantObjectId,
                WarehouseId = warehouseObjectId,
                OnHandQuantity = onHandQuantity,
                ReservedQuantity = 0,
                ReorderLevel = reorderLevel,
                CreatedAt = now,
                UpdatedAt = now
            };
            var transaction = new InventoryTransaction
            {
                VariantId = variantObjectId,
                WarehouseId = warehouseObjectId,
                Type = InventoryTransactionType.InitialStock,
                Quantity = onHandQuantity,
                OnHandAfter = onHandQuantity,
                ReservedAfter = 0,
                Reason = "Initial inventory setup",
                CreatedAt = now
            };
            await _context.Inventory.InsertOneAsync(session, inventory);
            await _context.InventoryTransaction.InsertOneAsync(session, transaction);
            await session.CommitTransactionAsync();
            committed = true;
            return inventory;
        }
        finally
        {
            if (!committed & session.IsInTransaction)
            {
                await session.AbortTransactionAsync();
            }
        }
    }
    public async Task<Inventory?> ReceiveStockAsync(string variantId, string warehouseId, int quantity, string reason)
    {
        if (!ObjectId.TryParse(variantId, out var variantObjectId))
            throw new ArgumentException("Invalid variant ID.");

        if (!ObjectId.TryParse(warehouseId, out var warehouseObjectId))
            throw new ArgumentException("Invalid warehouse ID.");

        if (quantity <= 0)
            throw new ArgumentOutOfRangeException(
                nameof(quantity),
                "Received quantity must be greater than zero.");
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Reason is required.");

        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();
        bool committed = false;
        try
        {
            var filter = Builders<Inventory>.Filter.And(
                Builders<Inventory>.Filter.Eq((i) => i.VariantId, variantObjectId),
                Builders<Inventory>.Filter.Eq((i) => i.WarehouseId, warehouseObjectId)
            );
            var update = Builders<Inventory>.Update.Inc((i) => i.OnHandQuantity, quantity).Set((i) => i.UpdatedAt, DateTime.UtcNow);
            var inventory = await _context.Inventory.FindOneAndUpdateAsync(session, filter, update, new FindOneAndUpdateOptions<Inventory>
            {
                ReturnDocument = ReturnDocument.After
            });
            if (inventory is null)
                throw new KeyNotFoundException("Inventory not found.");
            var transaction = new InventoryTransaction
            {
                VariantId = variantObjectId,
                WarehouseId = warehouseObjectId,
                Type = InventoryTransactionType.StockReceived,
                Quantity = quantity,
                OnHandAfter = inventory.OnHandQuantity,
                ReservedAfter = inventory.ReservedQuantity,
                Reason = reason,
                CreatedAt = DateTime.UtcNow
            };
            await _context.InventoryTransaction.InsertOneAsync(session, transaction);

            await session.CommitTransactionAsync();

            committed = true;

            return inventory;
        }
        finally
        {
            if (!committed & session.IsInTransaction)
            {
                await session.AbortTransactionAsync();
            }
        }
    }
    public async Task<Inventory?> AdjustStockAsync(
    string variantId,
    string warehouseId,
    int quantityChange,
    string reason)
    {
        if (!ObjectId.TryParse(variantId, out var variantObjectId))
            throw new ArgumentException("Invalid variant ID.");

        if (!ObjectId.TryParse(warehouseId, out var warehouseObjectId))
            throw new ArgumentException("Invalid warehouse ID.");

        if (quantityChange == 0)
            throw new ArgumentOutOfRangeException(
                nameof(quantityChange),
                "Adjustment cannot be zero.");

        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Reason is required.");

        using var session = await _context.Client.StartSessionAsync();

        session.StartTransaction();

        var committed = false;

        try
        {
            var filter = Builders<Inventory>.Filter.And(
                Builders<Inventory>.Filter.Eq(
                    item => item.VariantId,
                    variantObjectId),

                Builders<Inventory>.Filter.Eq(
                    item => item.WarehouseId,
                    warehouseObjectId),

                new BsonDocumentFilterDefinition<Inventory>(
                    BsonDocument.Parse(
                        $$"""
                    {
                        "$expr": {
                            "$gte": [
                                {
                                    "$add": [
                                        "$onHandQuantity",
                                        {{quantityChange}}
                                    ]
                                },
                                "$reservedQuantity"
                            ]
                        }
                    }
                    """))
            );

            var update = Builders<Inventory>.Update
                .Inc(item => item.OnHandQuantity, quantityChange)
                .Set(item => item.UpdatedAt, DateTime.UtcNow);

            var inventory = await _context.Inventory
                .FindOneAndUpdateAsync(
                    session,
                    filter,
                    update,
                    new FindOneAndUpdateOptions<Inventory>
                    {
                        ReturnDocument = ReturnDocument.After
                    });

            if (inventory is null)
                throw new InvalidOperationException(
                    "Inventory not found or adjustment would reduce stock below reserved quantity.");

            var transaction = new InventoryTransaction
            {
                VariantId = variantObjectId,
                WarehouseId = warehouseObjectId,
                Type = InventoryTransactionType.Adjustment,
                Quantity = quantityChange,
                OnHandAfter = inventory.OnHandQuantity,
                ReservedAfter = inventory.ReservedQuantity,
                Reason = reason,
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
    public async Task<List<Inventory>> GetLowStockAsync(string? warehouseId = null)
    {
        var filters = new List<FilterDefinition<Inventory>>();
        filters.Add(new BsonDocumentFilterDefinition<Inventory>(
            BsonDocument.Parse(
                """
                {
                    "$expr": {
                        "$lte": [
                            {
                                "$subtract": [
                                    "$onHandQuantity",
                                    "$reservedQuantity"
                                ]
                            },
                            "$reorderLevel"
                        ]
                    }
                }
                """)));
        if (!string.IsNullOrWhiteSpace(warehouseId))
        {
            if (!ObjectId.TryParse(warehouseId, out var warehouseObjectId))
                throw new ArgumentException("Invalid warehouse ID.");

            filters.Add(
                Builders<Inventory>.Filter.Eq(
                    item => item.WarehouseId,
                    warehouseObjectId)
            );
        }
        var filter = Builders<Inventory>.Filter.And(filters);
        return await _context.Inventory
            .Aggregate()
            .Match(filter)
            .AppendStage<Inventory>(
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "availableQuantity",
                        new BsonDocument(
                            "$subtract",
                            new BsonArray
                            {
                                "$onHandQuantity",
                                "$reservedQuantity"
                            }
                        )
                    )
                )
            ).Sort(new BsonDocument("availableQuantity", 1))
            .ToListAsync();
    }
    public async Task<List<InventoryTransaction>> GetTransactionsAsync(string variantId, string warehouseId, int page = 1, int pageSize = 20)
    {
        if (!ObjectId.TryParse(variantId, out var variantObjectId))
            throw new ArgumentException("Invalid variant ID.");

        if (!ObjectId.TryParse(warehouseId, out var warehouseObjectId))
            throw new ArgumentException("Invalid warehouse ID.");

        if (page < 1)
            throw new ArgumentOutOfRangeException(nameof(page));

        if (pageSize < 1 || pageSize > 100)
            throw new ArgumentOutOfRangeException(nameof(pageSize));
        var filter = Builders<InventoryTransaction>.Filter.And(
            Builders<InventoryTransaction>.Filter.Eq((t) => t.VariantId, variantObjectId),
            Builders<InventoryTransaction>.Filter.Eq((t) => t.WarehouseId, warehouseObjectId)
        );
        return await _context.InventoryTransaction
        .Find(filter)
        .SortByDescending((t) => t.CreatedAt)
        .Skip((page - 1) * pageSize).Limit(pageSize).ToListAsync();
    }
}