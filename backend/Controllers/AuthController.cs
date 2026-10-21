using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var registered = await _authService.Register(request);
        if (!registered)
        {
            return Conflict("A user with this email already exists");
        }
        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var result = await _authService.Login(request);

        if (result is null)
        {
            return Unauthorized("Invalid email or password");
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest request)
    {
        var result = await _authService.Refresh(request);
        if (result is null) return Unauthorized(new
        {
            message = "Invalid or exxpired refresh token"
        });

        return Ok(result);
    }

    [HttpPut("updateProfile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized();
        }
        var updated = await _authService.UpdateUser(userId, request);
        if (!updated) return BadRequest("Profile could not be updated.Check whether the email is already in use.");
        return Ok("Profile updated");
    }
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(RefreshRequest request)
    {
        var result = await _authService.Logout(request);

        if (!result)
        {
            return Unauthorized("Invalid or expired refresh token");
        }

        return Ok("logged Out");
    }

    [HttpDelete("account")]
    [Authorize]
    public async Task<IActionResult> DeactivateAccount()
    {
        var userId = User.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(userId) ||
            !MongoDB.Bson.ObjectId.TryParse(userId, out _))
        {
            return Unauthorized();
        }

        var deactivated = await _authService.DeactivateUser(userId);

        if (!deactivated)
        {
            return NotFound(new
            {
                message = "Active account not found"
            });
        }

        return NoContent();
    }

}