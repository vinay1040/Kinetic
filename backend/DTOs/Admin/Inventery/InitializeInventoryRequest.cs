public class InitializeInventoryRequest
{
    public string VariantId { get; set; } = string.Empty;

    public int WarehouseId { get; set; }

    public int OnHandQuantity { get; set; }

    public int ReorderLevel { get; set; } = 5;
}