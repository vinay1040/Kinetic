
namespace backend.DTOs.Products;

public enum ProductUpdateStatus
{
    Updated,
    NotFound,
    InvalidId
}

public class ProductUpdateResult
{
    public ProductUpdateStatus Status { get; set; }

    public bool WasModified { get; set; }
}
