using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Products;

public class CreateProductRequest
{
    [Required]
    [MinLength(1)]
    public List<string> Images { get; set; } = new();

    [Required]
    [Url]
    public string Thumbnail { get; set; } = string.Empty;

    [Required]
    [MinLength(2)]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MinLength(10)]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Range(typeof(decimal), "0.01", "999999999")]
    public decimal Price { get; set; }

    [Range(typeof(decimal), "0", "100")]
    public decimal DiscountPercentage { get; set; }

    [Required]
    [MinLength(2)]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Required]
    [MinLength(1)]
    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;
}
