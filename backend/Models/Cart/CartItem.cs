using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
public class CartItem
{
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProductId { get; set; } = string.Empty;

    public int Quantity { get; set; }
}