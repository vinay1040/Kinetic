using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;



[ApiController]
[Route("/api/[controller]")]
[Authorize(Roles ="Admin")]
public class InventoryController : ControllerBase
{
    private readonly InventoryService _service;
    public InventoryController(InventoryService service)
    {
        _service = service;
    }
    
}