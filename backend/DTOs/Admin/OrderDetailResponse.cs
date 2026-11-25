using backend.DTOs.Orders;

namespace backend.DTOs.Admin;

public class OrderDetailResponse
{
    public OrderResponse Order { get; set; } = new();

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;
}