namespace backend.DTOs.Products;

public enum ProductLookupStatus
{
    Found,
    NotFound,
    InvalidId
}

public class ProductLookupResult
{
    public ProductLookupStatus Status { get; set; }

    public ProductResponse? Product { get; set; }
}