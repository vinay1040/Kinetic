using System.ComponentModel.DataAnnotations;

namespace backend.Models.DTOs;

public class RegisterRequest
{
    [Required]
    [StringLength(100,MinimumLength =2)]
    public string name { get; set; } = string.Empty;
    [Required]
    [EmailAddress]
    [StringLength(254)]
    public string email { get; set; } = string.Empty;
    [Required]
    [MinLength(8)]
    [StringLength(128)]
    public string password { get; set; } = string.Empty;
}