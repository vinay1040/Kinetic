
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Products;

public class ProductPaginationRequest
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;

    public string? Search { get; set; }

    public List<string>? Categories { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal? MinPrice { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal? MaxPrice { get; set; }

    [Range(0, 5)]
    public double? MinRating { get; set; }

    [RegularExpression(
        "^(price|rating|title)$",
        ErrorMessage = "SortBy must be price, rating, or title.")]
    public string? SortBy { get; set; }

    [RegularExpression(
        "^(asc|desc)$",
        ErrorMessage = "SortOrder must be asc or desc.")]
    public string? SortOrder { get; set; }
}
