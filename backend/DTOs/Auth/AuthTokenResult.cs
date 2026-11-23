namespace backend.Models.DTOs;

public class AuthTokenResult
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;

    public UserProfileResponse User { get; set; } = new();
    public DateTime refreshTokenExpiresAt {get; set;}
}
