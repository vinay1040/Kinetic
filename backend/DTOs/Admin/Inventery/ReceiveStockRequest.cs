namespace backend.DTOs.Admin.Inventery;

public class ReceiveStockRequest
{
    public int Quantity { get; set; }

    public string Reason { get; set; } = string.Empty;
}