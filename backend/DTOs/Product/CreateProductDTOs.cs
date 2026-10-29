
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Products;

public class CreateProductRequest
{
    [Required, MinLength(2), MaxLength(250)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string MainCategory { get; set; } = string.Empty;

    [Required]
    public string SubCategory { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required, Url]
    public string Thumbnail { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();

    [Range(typeof(decimal), "0.01", "999999999")]
    public decimal Price { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal? OriginalPrice { get; set; }

    [Range(0, 5)]
    public double Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int NumberOfRatings { get; set; }

    [Url]
    public string ExternalUrl { get; set; } = string.Empty;
}
