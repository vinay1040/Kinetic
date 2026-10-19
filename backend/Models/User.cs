using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using backend.Models.Addresses;
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
   public string Name {get;set;} = string.Empty;
   public string Email { get; set; } = default!;
   public string PasswordHash { get; set; } = default!;

   public List<Address> Addresses {get;set;} = new();
   [BsonRepresentation(BsonType.String)]
   public UserRole Role { get; set; } = UserRole.Customer;
   public bool IsActive { get; set; } = true;
}