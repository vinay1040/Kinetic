namespace backend.DTOs.Orders;

public class OrderResponse
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public List<OrderItemResponse> Items { get; set; } = new();
    public ShippingAddressResponse ShippingAddress { get; set; } = new();
    public decimal Subtotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Total { get; set; }
    public int Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}