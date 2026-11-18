namespace backend.DTOs.Admin.Inventery;

public class UpdateStockRequest
{
    public int QuantityChange { get; set; }

    public string Reason { get; set; } = string.Empty;
}