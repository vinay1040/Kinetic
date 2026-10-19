using backend.data;
using backend.DTOs.Addresses;
using backend.Models;
using backend.Services;
using MongoDB.Bson;
using MongoDB.Driver;
using backend.Models.Addresses;
public class AddressService
{
    private readonly MongoDbContext _context;
    public AddressService(MongoDbContext context)
    {
        _context = context;
    }
    public async Task<User?> GetUserAsync(string userId)
    {
        if (ObjectId.TryParse(userId, out var objectId)) return null;
        return await _context.Users.Find(user => user.Id == objectId && user.IsActive).FirstOrDefaultAsync();
    }
    private static AddressResponse MapToResponse(Address address)
    {
        return new AddressResponse
        {
            Id = address.Id,
            Label = address.Label,
            FullName = address.FullName,
            Phone = address.Phone,
            AddressLine1 = address.AddressLine1,
            AddressLine2 = address.AddressLine2,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country,
            IsDefault = address.IsDefault
        };
    }
    private Address CreateAddress(AddressRequest request)
    {
        return new Address
        {
            Label = request.Label,
            FullName = request.FullName,
            Phone = request.Phone,
            AddressLine1 = request.AddressLine1,
            AddressLine2 = request.AddressLine2,
            City = request.City,
            State = request.State,
            PostalCode = request.PostalCode,
            Country = request.Country,
            IsDefault = false
        };
    }
    public async Task<List<AddressResponse>?> GetAddressResponseAsync(string userId)
    {
        var user = await GetUserAsync(userId);
        if (user is null) return null;
        return user.Addresses.Select(MapToResponse).ToList();
    }
    public async Task<AddressResponse?> AddAddressAsync(
    ObjectId userId,
    AddressRequest request)
    {
        var address = CreateAddress(request);

        // Read the existing Addresses array, or use an empty array.
        var existingAddresses = new BsonDocument(
            "$ifNull",
            new BsonArray { "$Addresses", new BsonArray() }
        );

        // Clear existing default flags only when the new address
        // is explicitly requested as the default.
        var updatedExistingAddresses = new BsonDocument(
            "$map",
            new BsonDocument
            {
            { "input", "$$existing" },
            { "as", "item" },
            {
                "in",
                new BsonDocument(
                    "$mergeObjects",
                    new BsonArray
                    {
                        "$$item",
                        new BsonDocument(
                            "IsDefault",
                            new BsonDocument(
                                "$cond",
                                new BsonArray
                                {
                                    new BsonDocument(
                                        "$literal",
                                        request.IsDefault
                                    ),
                                    false,
                                    "$$item.IsDefault"
                                }
                            )
                        )
                    }
                )
            }
            }
        );

        // The first address must be default.
        var newAddressIsDefault = new BsonDocument(
            "$or",
            new BsonArray
            {
            new BsonDocument(
                "$literal",
                request.IsDefault
            ),
            new BsonDocument(
                "$eq",
                new BsonArray
                {
                    new BsonDocument(
                        "$size",
                        "$$existing"
                    ),
                    0
                }
            )
            }
        );

        // Append the new address to the updated address array.
        var updatedAddresses = new BsonDocument(
            "$let",
            new BsonDocument
            {
            {
                "vars",
                new BsonDocument(
                    "existing",
                    existingAddresses
                )
            },
            {
                "in",
                new BsonDocument(
                    "$concatArrays",
                    new BsonArray
                    {
                        updatedExistingAddresses,
                        new BsonArray
                        {
                            new BsonDocument(
                                "$mergeObjects",
                                new BsonArray
                                {
                                    address.ToBsonDocument(),
                                    new BsonDocument(
                                        "IsDefault",
                                        newAddressIsDefault
                                    )
                                }
                            )
                        }
                    }
                )
            }
            }
        );

        var pipeline = PipelineDefinition<User, User>.Create(
            new[]
            {
            new BsonDocument(
                "$set",
                new BsonDocument(
                    "Addresses",
                    updatedAddresses
                )
            )
            }
        );

        var filter = Builders<User>.Filter.Eq(
            user => user.Id,
            userId
        );

        var update = Builders<User>.Update.Pipeline(pipeline);

        var updatedUser = await _context.Users.FindOneAndUpdateAsync(
            filter,
            update,
            new FindOneAndUpdateOptions<User>
            {
                ReturnDocument = ReturnDocument.After
            }
        );

        if (updatedUser is null) return null;

        var savedAddress = updatedUser.Addresses
            .FirstOrDefault(item => item.Id == address.Id);

        if (savedAddress is null) return null;
        
        return new AddressResponse
        {
            Id = savedAddress.Id,
            Label = savedAddress.Label,
            FullName = savedAddress.FullName,
            Phone = savedAddress.Phone,
            AddressLine1 = savedAddress.AddressLine1,
            AddressLine2 = savedAddress.AddressLine2,
            City = savedAddress.City,
            State = savedAddress.State,
            PostalCode = savedAddress.PostalCode,
            Country = savedAddress.Country,
            IsDefault = savedAddress.IsDefault
        };
    }

}