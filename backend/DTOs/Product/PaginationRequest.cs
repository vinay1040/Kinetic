using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Products;

public class ProductPaginationRequest
{
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 10;
    public string? Category { get; set; }
    [Range(0, double.MaxValue)]
    public decimal? MinPrice { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? MaxPrice { get; set; }
    [Range(0, 5)]
    public double? MinRating { get; set; }
    [RegularExpression(
    "^(price|rating|stock|title)$",
    ErrorMessage = "SortBy must be price, rating, stock, or title.")]
    public string? SortBy { get; set; }

    [RegularExpression(
        "^(asc|desc)$",
        ErrorMessage = "SortOrder must be asc or desc.")]
    public string? SortOrder { get; set; }
}