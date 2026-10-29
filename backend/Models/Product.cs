using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Product
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    public string Title { get; set; } = string.Empty;

    public string MainCategory { get; set; } = string.Empty;

    public string SubCategory { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Thumbnail { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();

    public decimal Price { get; set; }

    public decimal? OriginalPrice { get; set; }

    public double Rating { get; set; }

    public int NumberOfRatings { get; set; }

    public string ExternalUrl { get; set; } = string.Empty;
}
