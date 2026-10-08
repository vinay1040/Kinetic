using backend.Services;
using backend.Models;
using backend.DTOs.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductController : ControllerBase
{
    private readonly ProductServices _productService;

    public ProductController(ProductServices productServices)
    {
        _productService = productServices;
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var product = new Product
        {
            Title = request.Title,
            Description = request.Description,
            Price = request.Price,
            DiscountPercentage = request.DiscountPercentage,
            Category = request.Category,
            Stock = request.Stock,
            Brand = request.Brand,
            Thumbnail = request.Thumbnail,
            Images = request.Images
        };

        await _productService.CreateProduct(product);
        return Ok("product created successfully");
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 40)
    {
        var products = await _productService.GetProducts(page,pageSize);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        var result = await _productService.GetProductById(id);

        if (result is null)
        {
            return NotFound("Product not found");
        }

        return Ok(result);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatedProduct([FromQuery] string id, [FromBody] UpdateProductRequest product)
    {
        var updatedProduct = new Product
        {
            Title = product.Title,
            Description = product.Description,
            Price = product.Price,
            DiscountPercentage = product.DiscountPercentage,
            Category = product.Category,
            Stock = product.Stock,
            Brand = product.Brand,
            Thumbnail = product.Thumbnail,
            Images = product.Images
        };

        var updated = await _productService.UpdateProduct(id, updatedProduct);

        if (!updated)
        {
            return NotFound("Product not found");
        }

        return Ok("product updated successfully");
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct([FromQuery] string id)
    {
        await _productService.DeleteProduct(id);
        return Ok("product deleted successfully");
    }
}