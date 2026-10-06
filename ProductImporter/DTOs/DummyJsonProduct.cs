namespace ProductImporter.DTOs;

public class DummyJsonProduct
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string Category { get; set; } = string.Empty;

    public int Stock { get; set; }

    public double Rating { get; set; }

    public string Brand { get; set; } = string.Empty;

    public List<string> Images { get; set; } = new();

    public string Thumbnail { get; set; } = string.Empty;

    public decimal DiscountPercentage { get; set; }
}