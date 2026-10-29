
using backend.DTOs.Products;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly ProductServices _productService;

    public ProductController(ProductServices productService)
    {
        _productService = productService;
    }

    // GET: api/product
    [HttpGet]
    public async Task<IActionResult> GetProducts(
        [FromQuery] ProductPaginationRequest request)
    {
        var products = await _productService.GetProducts(request);
        return Ok(products);
    }

    // GET: api/product/categories
    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _productService.GetCategories();
        return Ok(categories);
    }

    // GET: api/product/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(string id)
    {
        var result = await _productService.GetProductById(id);

        if (result.Status == ProductLookupStatus.InvalidId)
        {
            return BadRequest(new
            {
                status = 400,
                message = "Invalid product ID"
            });
        }

        if (result.Status == ProductLookupStatus.NotFound)
        {
            return NotFound(new
            {
                status = 404,
                message = "Product not found"
            });
        }

        if (result.Product is not null)
        {
            return Ok(result.Product);
        }

        return StatusCode(500, new
        {
            status = 500,
            message = "Unexpected product lookup result"
        });
    }

    // POST: api/product
    [HttpPost]
    [Authorize(Policy = "ActiveUser", Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request)
    {
        var product = new Product
        {
            Title = request.Title,
            MainCategory = request.MainCategory,
            SubCategory = request.SubCategory,
            Category = request.Category,
            Thumbnail = request.Thumbnail,
            Images = request.Images,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Rating = request.Rating,
            NumberOfRatings = request.NumberOfRatings,
            ExternalUrl = request.ExternalUrl
        };

        var createdProduct =
            await _productService.CreateProduct(product);

        return CreatedAtAction(
            nameof(GetProductById),
            new { id = createdProduct.Id },
            createdProduct
        );
    }

    // PUT: api/product/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = "ActiveUser", Roles = "Admin")]
    public async Task<IActionResult> ReplaceProduct(
        [FromRoute] string id,
        [FromBody] ReplaceProductRequest request)
    {
        var product = new Product
        {
            Title = request.Title,
            MainCategory = request.MainCategory,
            SubCategory = request.SubCategory,
            Category = request.Category,
            Thumbnail = request.Thumbnail,
            Images = request.Images,
            Price = request.Price,
            OriginalPrice = request.OriginalPrice,
            Rating = request.Rating,
            NumberOfRatings = request.NumberOfRatings,
            ExternalUrl = request.ExternalUrl
        };

        var updated = await _productService.UpdateProduct(id, product);

        if (!updated)
        {
            return NotFound(new
            {
                status = 404,
                message = "Product not found or ID is invalid"
            });
        }

        return Ok(new
        {
            status = 200,
            message = "Product replaced successfully"
        });
    }

    // PATCH: api/product/{id}
    [HttpPatch("{id}")]
    [Authorize(Policy = "ActiveUser", Roles = "Admin")]
    public async Task<IActionResult> UpdateProductPartial(
        [FromRoute] string id,
        [FromBody] UpdateProductRequest request)
    {
        if (request is null || !request.HasUpdates())
        {
            return BadRequest(new
            {
                status = 400,
                message = "Provide at least one field to update."
            });
        }

        var result =
            await _productService.UpdateProductPartial(id, request);

        if (result.Status == ProductUpdateStatus.InvalidId)
        {
            return BadRequest(new
            {
                status = 400,
                message = "Invalid product ID"
            });
        }

        if (result.Status == ProductUpdateStatus.NotFound)
        {
            return NotFound(new
            {
                status = 404,
                message = "Product not found"
            });
        }

        return Ok(new
        {
            status = 200,
            message = result.WasModified
                ? "Product updated successfully"
                : "Product already has the requested values",
            modified = result.WasModified
        });
    }

    // DELETE: api/product/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = "ActiveUser", Roles = "Admin")]
    public async Task<IActionResult> DeleteProduct(
        [FromRoute] string id)
    {
        var result = await _productService.DeleteProduct(id);

        if (result.Status == ProductDeleteStatus.InvalidId)
        {
            return BadRequest(new
            {
                status = 400,
                message = "Invalid product ID"
            });
        }

        if (result.Status == ProductDeleteStatus.NotFound)
        {
            return NotFound(new
            {
                status = 404,
                message = "Product not found"
            });
        }

        return Ok(new
        {
            status = 200,
            message = "Product deleted successfully"
        });
    }
}
