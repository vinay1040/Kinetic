
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Orders;

public class OrderRequest
{
    [Required(ErrorMessage = "Shipping address ID is required")]
    public string ShippingAddressId { get; set; } = string.Empty;
}
