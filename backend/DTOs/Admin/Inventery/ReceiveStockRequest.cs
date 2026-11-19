using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Admin.Inventory;

public class ReceiveStockRequest
{
    [Required]
    public string ProductId { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Required]
    [StringLength(250, MinimumLength = 3)]
    public string Reason { get; set; } = string.Empty;
}