using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin.Inventory;

public class InitializeInventoryRequest
{
    [Required]
    public string ProductId { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int OnHandQuantity { get; set; }

    [Range(0, int.MaxValue)]
    public int ReorderLevel { get; set; } = 5;
}