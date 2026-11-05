
namespace backend.DTOs.Products;

public enum ProductDeleteStatus
{
    Deleted,
    NotFound,
    InvalidId
}

public class ProductDeleteResult
{
    public ProductDeleteStatus Status { get; set; }
}
 