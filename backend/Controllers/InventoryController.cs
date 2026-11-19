using backend.DTOs.Admin.Inventory;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "ActiveUser", Roles = "Admin")]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _inventoryService;

    public InventoryController(InventoryService inventoryService)
    {
        _inventoryService = inventoryService;
    }

    [HttpGet("{productId}")]
    public async Task<IActionResult> GetByProductId(string productId)
    {
        var inventory = await _inventoryService.GetInventorybyProductIdAsync(productId);

        if (inventory is null)
            return NotFound(new { message = "Inventory not found." });

        return Ok(inventory);
    }

    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var inventory = await _inventoryService.GetLowStockAsync();

        return Ok(inventory);
    }

    [HttpGet("{productId}/transactions")]
    public async Task<IActionResult> GetTransactionHistory(
        string productId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        var transactions =
            await _inventoryService.GetTransactionHistoryAsync(
                productId,
                pageNumber,
                pageSize);

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<IActionResult> InitializeInventory([FromBody] InitializeInventoryRequest request)
    {
        var inventory = await _inventoryService.InitializeInventoryAsync(request.ProductId, request.OnHandQuantity, request.ReorderLevel);
        return CreatedAtAction(
            nameof(GetByProductId),
            new { productId = inventory?.ProductId.ToString() },
            inventory);
    }
    [HttpPost("receive")]
    public async Task<IActionResult> ReceiveStock(
    [FromBody] ReceiveStockRequest request)
    {
        var inventory = await _inventoryService.ReceiveStockAsync(
            request.ProductId,
            request.Quantity,
            request.Reason);

        return Ok(inventory);
    }
    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustStock(
    [FromBody] UpdateStockRequest request)
    {
        var inventory = await _inventoryService.AdjustStockAsync(
            request.ProductId,
            request.QuantityChange,
            request.Reason);

        return Ok(inventory);
    }
}