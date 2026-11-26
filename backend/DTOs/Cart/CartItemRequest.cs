
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class CartItemRequest
{
    [Required]
    public string ProductId { get; set; } = string.Empty;

    [Range(1, 100)]
    public int Quantity { get; set; } = 1;
}