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
        if (!ObjectId.TryParse(userId, out var objectId)) return null;
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
    public async Task<List<AddressResponse>?> GetAddressAsync(string userId)
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

        var filter = Builders<User>.Filter.And(
            Builders<User>.Filter.Eq(
                user => user.Id, userId
            ),
            Builders<User>.Filter.Eq(user => user.IsActive, true)
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
    public async Task<AddressResponse?> UpdateAddress(ObjectId userId, ObjectId addressId, AddressRequest request)
    {
        var addressIdString = addressId.ToString();
        var filter = Builders<User>.Filter.And(
            Builders<User>.Filter.Eq(user => user.Id, userId),
            Builders<User>.Filter.Eq(user => user.IsActive, true),
            Builders<User>.Filter.ElemMatch(
                user => user.Addresses,
                address => address.Id == addressIdString
            )
        );
        var updatedFields = new BsonDocument
        {
            { "Label", request.Label },
            { "FullName", request.FullName },
            { "Phone", request.Phone },
            { "AddressLine1", request.AddressLine1 },
            { "AddressLine2", request.AddressLine2 },
            { "City", request.City },
            { "State", request.State },
            { "PostalCode", request.PostalCode },
            { "Country", request.Country }
        };
        var updateAddress = new BsonDocument
        (
            "$mergeObjects",
            new BsonArray
            {
                "$items",
                updatedFields,
                new BsonDocument(
                    "IsDefault",
                    request.IsDefault
                )
            }
        );
        var otherAddress = new BsonDocument(
            "$mergeObjects",
            new BsonArray
            {
                "$items",
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
        );
        var mappedAddresses = new BsonDocument(
        "$map",
        new BsonDocument
        {
            { "input", "$Addresses" },
            { "as", "item" },
            {
                "in",
                new BsonDocument(
                    "$cond",
                    new BsonArray
                    {
                        new BsonDocument(
                            "$eq",
                            new BsonArray
                            {
                                "$$item._id",
                                new BsonObjectId(addressId)
                            }
                        ),
                        updateAddress,
                        otherAddress
                    }
                )
            }
        });
        var pipeline = PipelineDefinition<User, User>.Create(
            new[]
            {
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "Addresses",
                        mappedAddresses
                    )
                )
            }
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
        var savedAddress = updatedUser.Addresses.FirstOrDefault(address => address.Id == addressIdString);
        if (savedAddress is null) return null;
        return MapToResponse(savedAddress);
    }
    public async Task<bool> DeleteAddress(ObjectId userId, ObjectId addressId)
    {
        var addressIdString = addressId.ToString();
        var filter = Builders<User>.Filter.And(
            Builders<User>.Filter.Eq(user => user.Id, userId),
            Builders<User>.Filter.Eq(user => user.IsActive, true),
            Builders<User>.Filter.ElemMatch(user => user.Addresses, address => address.Id == addressIdString)
        );
        var remainingAddresses = new BsonDocument(
            "$filter",
            new BsonDocument
            {
                { "input", "$Addresses" },
                { "as", "item" },
                {
                    "cond",
                    new BsonDocument(
                        "$ne",
                        new BsonArray
                        {
                            "$$item._id",
                            addressIdString
                        }
                    )
                }
            }
        );

        var normalizedAddresses = new BsonDocument(
            "$map",
            new BsonDocument
            {
            { "input", remainingAddresses },
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
                                "$eq",
                                new BsonArray
                                {
                                    "$$item._id",
                                    new BsonDocument(
                                        "$arrayElemAt",
                                        new BsonArray
                                        {
                                            new BsonDocument(
                                                "$map",
                                                new BsonDocument
                                                {
                                                    { "input", remainingAddresses },
                                                    { "as", "first" },
                                                    { "in", "$$first._id" }
                                                }
                                            ),
                                            0
                                        }
                                    )
                                }
                            )
                        )
                    }
                )
            }
            }
        );
        var pipeline = PipelineDefinition<User, User>.Create(
            [
                new BsonDocument(
                    "$set",
                    new BsonDocument(
                        "Addresses",
                        normalizedAddresses
                    )
                )
            ]
        );
        var update = Builders<User>.Update.Pipeline(pipeline);
        var result = await _context.Users.UpdateOneAsync(filter, update);
        return result.ModifiedCount > 0;
    }

}