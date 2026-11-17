using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Inventory;

public enum InventoryTransactionType
{
    InitialStock,
    StockReceived,
    Adjustment,
    Reserved,
    ReservationReleased,
    Sale,
    Return
}

public class InventoryTransaction
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    public ObjectId VariantId { get; set; }

    public ObjectId WarehouseId { get; set; }

    public InventoryTransactionType Type { get; set; }
    public int Quantity { get; set; }

    public int OnHandAfter { get; set; }

    public int ReservedAfter { get; set; }

    public string Reason { get; set; } = string.Empty;

    public string? ReferenceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}