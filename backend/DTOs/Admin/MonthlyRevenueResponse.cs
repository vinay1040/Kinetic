namespace backend.DTOs.Orders;

public class MonthlyRevenueResponse
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal Revenue { get; set; }
}