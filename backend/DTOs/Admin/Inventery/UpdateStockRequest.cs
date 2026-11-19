using System.ComponentModel.DataAnnotations;
namespace backend.DTOs.Admin.Inventory;
public class UpdateStockRequest : IValidatableObject
{
    [Required]
    public string ProductId { get; set; } = string.Empty;
    public int QuantityChange { get; set; }
    [Required]
    [StringLength(250, MinimumLength = 3)]
    public string Reason { get; set; } = string.Empty;
    public IEnumerable<ValidationResult> Validate(
        ValidationContext validationContext)
    {
        if (QuantityChange == 0)
        {
            yield return new ValidationResult(
                "Adjustment quantity cannot be zero.",
                new[] { nameof(QuantityChange) });
        }
    }
}