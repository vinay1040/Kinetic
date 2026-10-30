using backend.Services;
using Kinetic.DTOs.Inventory;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ActiveUser", Roles = "Admin")]
public class InventoryController : ControllerBase
{
    public InventoryController(InventoryService service) : base()
    {
        _service = service;
    }

    private readonly InventoryService _service;
    // GET: api/inventory/{productId}
    [HttpGet("{productId}")]
    public async Task<IActionResult> GetInventory(string productId)
    {
        var inventory = await _service.GetByProductIdAsync(productId);

        if (inventory is null)
        {
            return NotFound(new
            {
                message = "Inventory not found for this product."
            });
        }

        return Ok(inventory);
    }

    // POST: api/inventory
    [HttpPost]
    public async Task<IActionResult> InitializeInventory(
        [FromBody] InitializeInventoryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ProductId))
        {
            return BadRequest(new
            {
                message = "Product ID is required."
            });
        }

        if (request.OnHandQuantity < 0 || request.ReorderLevel < 0)
        {
            return BadRequest(new
            {
                message = "Stock quantity and reorder level cannot be negative."
            });
        }

        var inventory = await _service.InitializeInventoryAsync(
            request.ProductId,
            request.OnHandQuantity,
            request.ReorderLevel);

        return CreatedAtAction(
            nameof(GetInventory),
            new { productId = request.ProductId },
            inventory);
    }

    // GET: api/inventory/{productId}/availability?quantity=2
    [HttpGet("{productId}/availability")]
    public async Task<IActionResult> CheckAvailability(
        string productId,
        [FromQuery] int quantity)
    {
        if (quantity <= 0)
        {
            return BadRequest(new
            {
                message = "Quantity must be greater than zero."
            });
        }

        var isAvailable = await _service.HasAvailableQuantityAsync(
            productId,
            quantity);

        var inventory = await _service.GetByProductIdAsync(productId);

        if (inventory is null)
        {
            return NotFound(new
            {
                message = "Inventory not found for this product."
            });
        }

        return Ok(new
        {
            productId,
            requestedQuantity = quantity,
            available = isAvailable,
            availableQuantity = inventory.AvailableQuantity
        });
    }

    [HttpPost("{productId}/stock")]
    public async Task<IActionResult> AddStock(
        string productId,
        [FromBody] AddStockRequest request)
    {
        if (request.Quantity <= 0)
        {
            return BadRequest(new
            {
                message = "Quantity must be greater than zero."
            });
        }

        var updated = await _service.AddStockAsync(
            productId,
            request.Quantity);

        if (!updated)
        {
            return NotFound(new
            {
                message = "Inventory not found for this product."
            });
        }

        var inventory = await _service.GetByProductIdAsync(productId);

        return Ok(new
        {
            message = "Stock added successfully.",
            inventory
        });
    }

    [HttpPost("initialize-all")]
    public async Task<IActionResult> InitializeAllInventory()
    {
        try
        {
            var createdCount =
                await _service.InitializeAllInventoryAsync(
                    onHandQuantity: 100,
                    reorderLevel: 10);

            return Ok(new
            {
                message = "Inventory initialization completed.",
                createdCount
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Inventory initialization failed.",
                error = ex.Message
            });
        }
    }

}

