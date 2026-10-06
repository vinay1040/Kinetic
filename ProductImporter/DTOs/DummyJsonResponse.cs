namespace ProductImporter.DTOs;

public class DummyJsonResponse
{
    public List<DummyJsonProduct> Products { get; set; } = new();

    public int Total { get; set; }

    public int Skip { get; set; }

    public int Limit { get; set; }
}