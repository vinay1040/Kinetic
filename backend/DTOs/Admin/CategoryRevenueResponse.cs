namespace backend.DTOs.Admin;

public class CategoryRevenueResponse
{
    public string Category { get; set; } = string.Empty;

    public decimal Revenue { get; set; }

    public decimal Percentage { get; set; }
}