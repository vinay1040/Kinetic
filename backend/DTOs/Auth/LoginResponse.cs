namespace backend.Models.DTOs;

public class LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public UserProfileResponse User { get; set; } = new();
}