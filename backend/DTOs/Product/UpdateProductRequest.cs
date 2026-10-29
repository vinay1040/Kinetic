
using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Products;

public class UpdateProductRequest
{
    [MinLength(2), MaxLength(250)]
    public string? Title { get; set; }

    public string? MainCategory { get; set; }

    public string? SubCategory { get; set; }

    public string? Category { get; set; }

    [Url]
    public string? Thumbnail { get; set; }

    public List<string>? Images { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal? Price { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal? OriginalPrice { get; set; }

    [Range(0, 5)]
    public double? Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int? NumberOfRatings { get; set; }

    [Url]
    public string? ExternalUrl { get; set; }

    public bool HasUpdates()
    {
        return Title is not null
            || MainCategory is not null
            || SubCategory is not null
            || Category is not null
            || Thumbnail is not null
            || Images is not null
            || Price.HasValue
            || OriginalPrice.HasValue
            || Rating.HasValue
            || NumberOfRatings.HasValue
            || ExternalUrl is not null;
    }
}
