namespace backend.Models.DTOs;

public class RegisterRequest
{
    public string name{get;set;} = string.Empty;
    public string email{get;set;} = string.Empty;
    public string password{get; set;} = string.Empty;
}