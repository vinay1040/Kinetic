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

        if (string.IsNullOrWhiteSpace(userIdClaim) ||
        !ObjectId.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var address = await _addressService.AddAddressAsync(userId, request);
        if (address is null)
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
    [HttpGet]
    public async Task<IActionResult> GetAddressAsync()
    {
        var userIdClaim = User.FindFirstValue("sub") ??
        User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userIdClaim) ||
        !ObjectId.TryParse(userIdClaim, out _))
        {
            return Unauthorized();
        }
        var addresses = await _addressService.GetAddressAsync(userIdClaim);
        if (addresses is null)
        {
            return NotFound(new
            {
                message = "User Not Found"
            });
        }
        return Ok(addresses);
    }

    [HttpPut("{addressId}")]
    public async Task<IActionResult> UpdateAddress([FromRoute] string addressId, [FromBody] AddressRequest request)
    {
        var userIdClaim = User.FindFirstValue("sub") ??
       User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdClaim) || !ObjectId.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        if (!ObjectId.TryParse(addressId, out var parsedAddressId))
        {
            return BadRequest(new
            {
                message = "Invalid address ID"
            });
        }
        var address = await _addressService.UpdateAddress(userId, parsedAddressId, request);
        if (address is null) return NotFound(new
        {
            message = "Address not found"
        });
        return Ok(address);
    }

    [HttpDelete("{addressId}")]
    public async Task<IActionResult> DeleteAddress(string addressId)
    {
        var userIdClaim = User.FindFirstValue("sub") ??
        User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userIdClaim) ||
        !ObjectId.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        if (!ObjectId.TryParse(addressId, out var parsedAddressId))
        {
            return BadRequest(new
            {
                message = "Invalid address Id"
            });
        }
        var result = await _addressService.DeleteAddress(userId, parsedAddressId);
        if (!result)
        {
            return NotFound(new
            {
                message = "Address not found"
            });
        }
        return NoContent();
    }

}