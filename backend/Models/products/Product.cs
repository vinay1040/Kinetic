using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

[BsonIgnoreExtraElements]
public class Product
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("mainCategory")]
    public string MainCategory { get; set; } = string.Empty;

    [BsonElement("subCategory")]
    public string SubCategory { get; set; } = string.Empty;

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("thumbnail")]
    public string Thumbnail { get; set; } = string.Empty;

    [BsonElement("images")]
    public List<string> Images { get; set; } = new();

    [BsonElement("price")]
    public decimal? Price { get; set; }

    [BsonElement("originalPrice")]
    public decimal? OriginalPrice { get; set; }

    [BsonElement("rating")]
    public double? Rating { get; set; }

    [BsonElement("numberOfRatings")]
    public int? NumberOfRatings { get; set; }

    [BsonElement("externalUrl")]
    public string ExternalUrl { get; set; } = string.Empty;
}