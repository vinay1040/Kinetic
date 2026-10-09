namespace backend.DTOs.Products;

using System.ComponentModel.DataAnnotations;

public class UpdateProductRequest
{
    [MinLength(2)]
    [MaxLength(150)]
    public string? Title { get; set; }
    [MinLength(10)]
    [MaxLength(2000)]
    public string? Description { get; set; }
    [Range(0, int.MaxValue)]
    public decimal? Price { get; set; }
    [Range(0, 100)]
    public decimal? DiscountPercentage { get; set; }

    [MinLength(2)]
    [MaxLength(100)]
    public string? Category { get; set; }
    [Range(0, int.MaxValue)]
    public int? Stock { get; set; }
    public string? Brand { get; set; }
    public string? Thumbnail { get; set; }
    public List<string>? Images { get; set; }

    public bool HasUpdates()
    {
        return Title is not null
            || Description is not null
            || Price.HasValue
            || DiscountPercentage.HasValue
            || Category is not null
            || Stock.HasValue
            || Brand is not null
            || Thumbnail is not null
            || Images is not null;
    }

}