  namespace Kinetic.DTOs.Inventory;
public class InitializeInventoryRequest
{
    public string ProductId { get; set; } = string.Empty;
    public int OnHandQuantity { get; set; }
    public int ReorderLevel { get; set; } = 5;
}