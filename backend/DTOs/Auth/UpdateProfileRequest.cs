using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class UpdateProfileRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}