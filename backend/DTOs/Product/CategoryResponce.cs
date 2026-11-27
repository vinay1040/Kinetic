namespace backend.DTOs.Products;

public class CategoryResponce
{
    public string MainCategory {get; set;} = string.Empty;
    public List<string> SubCategory {get; set;} = [];
}