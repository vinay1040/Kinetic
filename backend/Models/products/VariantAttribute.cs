
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Products;

public class VariantAttribute
{
    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("value")]
    public string Value { get; set; } = string.Empty;
}
