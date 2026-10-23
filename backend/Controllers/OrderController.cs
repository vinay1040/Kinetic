using System.Security.Claims;
using backend.Controllers;
using backend.DTOs.Orders;
using backend.Models.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly OrderService _orderService;
    public OrderController(OrderService service)
    {
        _orderService = service;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(string.IsNullOrWhiteSpace(userId)) return Unauthorized();
        var order = await _orderService.CreateOrderAsync(userId,request);
        if (order is null)
        {
            return BadRequest(new
            {
                message = "Unable to create order. Check your address, cart, and product stock."
            });
        }
        return StatusCode(201, new
        {
            message = "Order Created Successfully",
            order
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetOrder()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(string.IsNullOrWhiteSpace(userId)) return Unauthorized();
        var order = await _orderService.GetOrdersAsync(userId);
        return Ok(order);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderById(string id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if(string.IsNullOrWhiteSpace(userId)) return Unauthorized();
        var order = await _orderService.GetOrderByIdAsync(userId,id);
        if(order is null)
        {
            return NotFound(new
            {
                message = "Invalid User Id"
            });
        }
        return Ok(order);
    }
}