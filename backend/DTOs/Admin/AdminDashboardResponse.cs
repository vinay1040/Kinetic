namespace backend.DTOs.Admin;

public class AdminDashboardResponse
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public int TotalCustomers { get; set; }
    public decimal AverageOrderValue { get; set; }
}