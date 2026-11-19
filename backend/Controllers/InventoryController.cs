using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("/api/[controller]")]
[Authorize(Policy ="ActiveUser", Roles ="Admin")]
public class InventoryController : ControllerBase
{
    [HttpGet("/inventory/")]
    public async Task<IActionResult> GetProductInventory()
    {
        
    }
}