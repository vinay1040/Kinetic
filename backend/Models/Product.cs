using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;
public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId id {get;set;} = ObjectId.GenerateNewId();
    public string tittle {get;set;} = string.Empty;
    public string discription {get;set;} = string.Empty;
    public decimal price {get;set;} 
    public string category{get;set;} = string.Empty;
    public int stock {get;set;} 
    public double rating {get;set;}
    public string brand {get;set;} = string.Empty;
}