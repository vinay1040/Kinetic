using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using MongoDB.Bson;
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
    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> CreateProduct(Product product)
    {
        await _productService.CreateProduct(product);
        return Ok("product created successfully");
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _productService.GetProducts();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        var result = await _productService.GetProductById(id);

        if(result is null) return NotFound("Product not found");

        return Ok(result);
    }

    [HttpPut]
    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> UpdatedProduct(string id,Product product)
    {
        var updated = await _productService.UpdateProduct(id,product);
        if(!updated) return NotFound("Product not found");
        return Ok(
            "product updated successfully"
        );
    }

    [HttpDelete]
    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var result = await _productService.DeleteProduct(id);

        return Ok("product deleted successfully");
    }
}