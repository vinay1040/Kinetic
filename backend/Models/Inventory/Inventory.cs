using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Models.Inventory;
public class Inventory
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    [BsonRequired]
    [BsonElement("variantId")]
    public ObjectId VariantId { get; set; }

    [BsonRequired]
    [BsonElement("warehouseId")]
    public ObjectId WarehouseId { get; set; }

    [BsonElement("onHandQuantity")]
    public int OnHandQuantity { get; set; }

    [BsonElement("reservedQuantity")]
    public int ReservedQuantity { get; set; }

    [BsonElement("reorderLevel")]
    public int ReorderLevel { get; set; } = 5;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonIgnore]
    public int AvailableQuantity => OnHandQuantity - ReservedQuantity;
}
