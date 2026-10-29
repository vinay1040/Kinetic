
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Inventory
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    [BsonRequired]
    public ObjectId ProductId { get; set; }

    // Physical units currently held in inventory.
    public int OnHandQuantity { get; set; }

    // Units reserved for orders that have not been finalized.
    public int ReservedQuantity { get; set; }

    // Alert the admin when available units reach this threshold.
    public int ReorderLevel { get; set; } = 5;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonIgnore]
    public int AvailableQuantity =>
        OnHandQuantity - ReservedQuantity;
}
