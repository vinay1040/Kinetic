
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Cart;

public class UpdateCartQuantityRequest
{
    [Range(1, 100)]
    public int Quantity { get; set; }
}
