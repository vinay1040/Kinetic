
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models.Orders;

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    public List<OrderItem> Items { get; set; } = new();

    public ShippingAddress ShippingAddress { get; set; } = new();

    public decimal Subtotal { get; set; }

    public decimal ShippingCost { get; set; }

    public decimal Total { get; set; }

    [BsonRepresentation(BsonType.String)]
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
