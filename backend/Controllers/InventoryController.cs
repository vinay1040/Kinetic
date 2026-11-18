using backend.DTOs.Admin.Inventery;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace backend.Controllers;

[ApiController]
[Route("/api/[controller]")]
[Authorize(Policy = "ActiveUser", Roles = "Admin")]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _service;
    public InventoryController(InventoryService service)
    {
        _service = service;
    }
    [HttpGet("variant/{variantId}/warehouse/{warehouseId}")]
    public async Task<IActionResult> GetByVariant(string variantId, string warehouseId)
    {
        var inventory = await _service.GetByVariantAsync(
           variantId,
           warehouseId);
        if (inventory is null) return NotFound(new { message = "Inventory not found." });
        return Ok(inventory);
    }
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock(
       [FromQuery] string? warehouseId = null)
    {
        var inventory = await _service.GetLowStockAsync(warehouseId);

        return Ok(inventory);
    }
    [HttpPost("Initialize")]
    public async Task<IActionResult> Initialize([FromBody] InitializeInventoryRequest request)
    {
        var inventory = await _service.InitializeAsync(request.VariantId, request.WarehouseId, request.OnHandQuantity, request.ReorderLevel);
        return CreatedAtAction(
            nameof(GetByVariant),
            new
            {
                variantId = request.VariantId,
                warehouseId = request.WarehouseId
            },
            inventory);
    }

    [HttpPost("variant/{variantId}/warehouse/{warehouseId}/receive")]
    public async Task<IActionResult> ReceiveStock(string variantId, string warehouseId, [FromBody] ReceiveStockRequest request)
    {
        var result = await _service.ReceiveStockAsync(variantId, warehouseId, request.Quantity, request.Reason);
        return Ok(result);
    }

    [HttpPost("variant/{variantId}/warehouse/{warehouseId}/adjust")]
    public async Task<IActionResult> AdjustStock(string variantId, string warehouseId, [FromBody] UpdateStockRequest request)
    {
        var inventory = await _service.AdjustStockAsync(variantId, warehouseId, request.QuantityChange, request.Reason);
        return Ok(inventory);
    }

    [HttpGet("variant/{variantId}/warehouse/{warehouseId}/transactions")]
    public async Task<IActionResult> GetTransaction(string variantId, string warehouseId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var transaction = await _service.GetTransactionsAsync(variantId, warehouseId, page, pageSize);
        return Ok(transaction);
    }
    [HttpGet("variant/{variantId}/warehouse/{warehouseId}/availability/")]
    public async Task<IActionResult> CheckAvailability(string variantId, string warehouseId,[FromQuery] int quantity)
    {
        var avail = await _service.CheckAvailabilityAsync(variantId,warehouseId,quantity);
        return Ok(avail);
    }
}