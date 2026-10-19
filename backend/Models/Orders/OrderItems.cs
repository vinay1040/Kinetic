
namespace backend.Models.Orders;

public class OrderItem
{
    public string ProductId { get; set; } = string.Empty;

    public string ProductTitle { get; set; } = string.Empty;

    public string Thumbnail { get; set; } = string.Empty;

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal LineTotal { get; set; }
}
