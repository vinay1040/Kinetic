using System.Security.Claims;
using backend.Controllers;
using backend.DTOs.Cart;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;


[ApiController]
[Route("/api/cart")]
[Authorize(Policy = "ActiveUser")]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;
    public CartController(CartService service)
    {
        _cartService = service;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirstValue("sub") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetCurrentUserId();

        if (string.IsNullOrWhiteSpace(userId) ||
        !ObjectId.TryParse(userId, out _))
            return Unauthorized();

        var cart = await _cartService.GetCartAsync(userId);
        if (cart is null)
        {
            return Ok(new
            {
                items = Array.Empty<object>(),
                message = "Your cart is empty"
            });
        }
        return Ok(cart);
    }
    [HttpPost]
    public async Task<IActionResult> AddItems([FromBody] CartItemRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId) ||
        !ObjectId.TryParse(userId, out _)) return Unauthorized();
        if (!ObjectId.TryParse(request.ProductId, out _))
        {
            return BadRequest(
                new
                {
                    message = "Invalid Product Id"
                }
            );
        }
        var cart = await _cartService.AddItemAsync(userId, request.ProductId, request.Quantity);
        if (cart is null)
            return BadRequest(
                new
                {
                    message = "Product or user not found, or quantity exceeds available stock"
                }
            );

        return Ok(cart);
    }

    [HttpPut("items/{productId}")]
    public async Task<IActionResult> UpdateCart(string productId, [FromBody] UpdateCartQuantityRequest request)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId) ||
        !ObjectId.TryParse(userId, out _)) return Unauthorized();
        if (!ObjectId.TryParse(productId, out _))
            return BadRequest(new
            {
                message = "Invalid product ID"
            });
        if (request.Quantity < 1 || request.Quantity > 100)
        {
            return BadRequest(new
            {
                message = "Quantity must be between 1 and 100"
            });
        }
        var cart = await _cartService.UpdateCartAsync(userId, productId, request.Quantity);
        if (cart is null)
        {
            return NotFound(new
            {
                message = "Cart item not found, product unavailable, or quantity exceeds stock"
            });
        }
        return Ok(cart);
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> DeleteCartItem(string productId)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrWhiteSpace(userId) ||
        !ObjectId.TryParse(userId, out _)) return Unauthorized();
        if (!ObjectId.TryParse(productId, out _))
        {
            return BadRequest(new { message = "Invalid Product Id" });
        }
        var cart = await _cartService.RemoveItemAsync(userId, productId);
        if (cart is null)
        {
            return NotFound(new { message = "Cart or cart item not found" });
        }
        return Ok(cart);
    }
}