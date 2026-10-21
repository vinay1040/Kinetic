using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [MinLength(8)]
    public string Password { get; set; } = string.Empty;
}