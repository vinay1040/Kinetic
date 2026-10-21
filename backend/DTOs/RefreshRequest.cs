using System.ComponentModel.DataAnnotations;
using backend.Models.DTOs;

public class RefreshRequest
{
    [Required]
    public string RefreshToken {get;set;} = string.Empty;
    
}