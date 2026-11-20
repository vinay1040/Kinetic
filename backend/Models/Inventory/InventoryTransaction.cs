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
    Return,
    StockRestored
}

public class InventoryTransaction
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    [BsonRequired]
    [BsonRepresentation(BsonType.String)]
    public ObjectId ProductId { get; set; }

    [BsonRepresentation(BsonType.String)]
    public InventoryTransactionType Type { get; set; }

    // Positive or negative change to physical stock.
    public int OnHandChange { get; set; }

    public int ReservedChange { get; set; }

    public int OnHandAfter { get; set; }

    public int ReservedAfter { get; set; }

    public string Reason { get; set; } = string.Empty;

    public ObjectId? ReferenceId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
