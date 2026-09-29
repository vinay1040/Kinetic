using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

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

        if(result is null)
        {
            return Unauthorized("Invalid email or password");
        }
        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshRequest request)
    {
        var result = await _authService.Refresh(request);
        if(result is null) return Unauthorized("Invalid or exxpired refresh token");

        return Ok(result);
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
}