namespace backend.DTOs.Products;
public class ProductResponse
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string MainCategory { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Thumbnail { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new();
    public decimal? Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public double? Rating { get; set; }
    public int? NumberOfRatings { get; set; }

    public string ExternalUrl { get; set; } = string.Empty;
}
