using backend.Controllers;
using backend.DTOs.Addresses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize]

public class AddressController : ControllerBase
{
    private readonly AddressService _addressService;
    public AddressController(AddressService service)
    {
        _addressService = service;
    }

    [HttpPost]
    public async Task<IActionResult> AddAddress([FromBody] AddressRequest request)
    {
        var userIdClaim = User.FindFirstValue("sub") ??
        User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(string.IsNullOrWhiteSpace(userIdClaim) ||
        ObjectId.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var address = _addressService.AddAddressAsync(userId,request);
        if(address is null)
        {
            return NotFound(new
            {
                message = "User Not Found"
            });
        }

        return StatusCode(
            StatusCodes.Status201Created,
            address
        );
    }
    
}