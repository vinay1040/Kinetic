using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace backend.Models;

public enum UserRole
{
   Customer,
   Admin
}
public class User
{
   [BsonId]
   public ObjectId Id { get; set; } = ObjectId.GenerateNewId();
   
   public string Email { get; set; } = default!;
   public string PasswordHash { get; set; } = default!;
   [BsonRepresentation(BsonType.String)]
   public UserRole Role { get; set; } = UserRole.Customer;
   public bool IsActive { get; set; } = true;
}