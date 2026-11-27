namespace backend.DTOs.Products;

public class PaginationResponse
{
    public List<ProductResponse> Products { get; set; } = new();

    public int Page { get; set; }

    public int PageSize { get; set; }

    public long TotalProducts { get; set; }

    public int TotalPages { get; set; }
}