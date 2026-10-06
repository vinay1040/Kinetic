namespace backend.DTOs.Products;

public class UpdateProductRequest
{
    public List<string> Images { get; set; } = new();

    public string Thumbnail { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public decimal DiscountPercentage { get; set; }

    public string Category { get; set; } = string.Empty;

    public int Stock { get; set; }

    public string Brand { get; set; } = string.Empty;
}