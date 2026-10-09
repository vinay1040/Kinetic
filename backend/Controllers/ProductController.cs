using backend.Services;
using backend.Models;
using backend.DTOs.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ProductController : ControllerBase
{
    private readonly ProductServices _productService;

    public ProductController(ProductServices productServices)
    {
        _productService = productServices;
    }


    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateProduct(
        [FromBody] CreateProductRequest request)
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

        var createdProduct = await _productService.CreateProduct(product);

        return CreatedAtAction(
            nameof(GetProductById),
            new { id = createdProduct.Id },
            createdProduct
        );
    }


    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] ProductPaginationRequest request)
    {
        var products = await _productService.GetProducts(request);
        return Ok(products);
    }


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

        if (result.Status == ProductLookupStatus.Found &&
            result.Product is not null)
        {
            return Ok(result.Product);
        }

        return StatusCode(500, new
        {
            status = 500,
            message = "Unexpected product lookup result"
        });
    }


    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(
        [FromRoute] string id,
        [FromBody] ReplaceProductRequest request)
    {
        var updatedProduct = new Product
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

        var updated = await _productService.UpdateProduct(id, updatedProduct);

        if (!updated)
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
            message = "Product updated successfully"
        });
    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProductPartial(
        string id,
        [FromBody] UpdateProductRequest request)
    {
        if (request is null)
        {
            return BadRequest(new
            {
                status = 400,
                message = "Request cannot be null"
            });
        }

        if (!request.HasUpdates())
        {
            return BadRequest(new
            {
                status = 400,
                message = "At least one field must be provided for update."
            });
        }
        
        var result = await _productService.UpdateProductPartial(id, request);

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

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct([FromRoute] string id)
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