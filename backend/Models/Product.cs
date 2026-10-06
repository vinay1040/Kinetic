using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal DiscountPercentage { get; set; }

    public string Category { get; set; } = string.Empty;

    public int Stock { get; set; }

    public double Rating { get; set; }

    public string Brand { get; set; } = string.Empty;

    public string Thumbnail { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();
}