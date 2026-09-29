using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class RefreshToken
{
    [BsonId]
    public ObjectId Id { get; set; } = ObjectId.GenerateNewId();

    public ObjectId UserId { get; set; }

    public string TokenHash { get; set; } = default!;

    public DateTime ExpiresAt { get; set; }

    public DateTime? RevokedAt { get; set; }

    public bool IsActive =>
        RevokedAt == null && ExpiresAt > DateTime.UtcNow;
}