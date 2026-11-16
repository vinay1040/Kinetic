using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Products;

public class ProductVariant
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    [BsonRequired]
    [BsonElement("productId")]
    public ObjectId ProductId { get; set; }

    [BsonRequired]
    [BsonElement("sku")]
    public string SKU { get; set; } = string.Empty;

    [BsonElement("attributes")]
    public List<VariantAttribute> Attributes { get; set; } = new();

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("compareAtPrice")]
    public decimal? CompareAtPrice { get; set; }

    [BsonElement("isActive")]
    public bool IsActive { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}