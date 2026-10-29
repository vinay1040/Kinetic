using backend.data;
using backend.Models;
using backend.Services;
using MongoDB.Bson;
using MongoDB.Driver;

public class CartService
{
    private readonly MongoDbContext _context;
    private readonly InventoryService _inventoryService;

    public CartService(MongoDbContext context, InventoryService inventoryService)
    {
        _context = context;
        _inventoryService = inventoryService;
    }
    public async Task<Cart?> GetCartAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out var userObjectId)) return null;

        var user = await _context.Users
            .Find(u => u.Id == userObjectId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user is null) return null;

        return await _context.Cart
            .Find(c => c.UserId == userId)
            .FirstOrDefaultAsync();
    }

    public async Task<Cart?> AddItemAsync(
        string userId,
        string productId,
        int quantity)
    {
        if (quantity <= 0 ||
            !ObjectId.TryParse(userId, out var userObjectId) ||
            !ObjectId.TryParse(productId, out var productObjectId)) return null;

        var user = await _context.Users
            .Find(u => u.Id == userObjectId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user is null) return null;

        var product = await _context.Products
            .Find(p => p.Id == productObjectId)
            .FirstOrDefaultAsync();

        if (product is null) return null;

        var inventory = await _inventoryService
            .GetByProductIdAsync(productId);

        if (inventory is null ||
            inventory.AvailableQuantity <= 0 ||
            quantity > inventory.AvailableQuantity)
        {
            return null;
        }

        var cart = await _context.Cart
            .Find(c => c.UserId == userId)
            .FirstOrDefaultAsync();

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = userId,
                Items = new List<CartItem>
                {
                    new()
                    {
                        ProductId = productId,
                        Quantity = quantity
                    }
                }
            };

            await _context.Cart.InsertOneAsync(cart);
            return cart;
        }

        var existingItem = cart.Items
            .FirstOrDefault(item => item.ProductId == productId);

        if (existingItem is not null)
        {
            var newQuantity = existingItem.Quantity + quantity;

            if (newQuantity > inventory.AvailableQuantity) return null;

            var update = Builders<Cart>.Update
                .Inc("Items.$.Quantity", quantity)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _context.Cart.UpdateOneAsync(
                c => c.Id == cart.Id &&
                     c.Items.Any(item => item.ProductId == productId),
                update);

            if (result.MatchedCount == 0) return null;
        }
        else
        {
            var update = Builders<Cart>.Update
                .Push(
                    c => c.Items,
                    new CartItem
                    {
                        ProductId = productId,
                        Quantity = quantity
                    })
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await _context.Cart.UpdateOneAsync(
                c => c.Id == cart.Id,
                update);

            if (result.MatchedCount == 0) return null;
        }

        return await GetCartAsync(userId);
    }

    public async Task<Cart?> UpdateCartAsync(
        string userId,
        string productId,
        int quantity)
    {
        if (quantity <= 0 ||
            !ObjectId.TryParse(userId, out var userObjectId) ||
            !ObjectId.TryParse(productId, out var productObjectId))
        {
            return null;
        }

        var user = await _context.Users
            .Find(u => u.Id == userObjectId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user is null) return null;

        var product = await _context.Products
            .Find(p => p.Id == productObjectId)
            .FirstOrDefaultAsync();

        if (product is null) return null;

        var inventory = await _inventoryService
            .GetByProductIdAsync(productId);

        if (inventory is null ||
            inventory.AvailableQuantity < quantity)
        {
            return null;
        }

        var update = Builders<Cart>.Update
            .Set("Items.$.Quantity", quantity)
            .Set(c => c.UpdatedAt, DateTime.UtcNow);

        var result = await _context.Cart.UpdateOneAsync(
            c => c.UserId == userId &&
                 c.Items.Any(item => item.ProductId == productId),
            update);

        if (result.MatchedCount == 0)
            return null;

        return await GetCartAsync(userId);
    }

    public async Task<Cart?> RemoveItemAsync(
        string userId,
        string productId)
    {
        if (!ObjectId.TryParse(userId, out var userObjectId) ||
            !ObjectId.TryParse(productId, out _))
        {
            return null;
        }

        var user = await _context.Users
            .Find(u => u.Id == userObjectId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user is null) return null;

        var cart = await _context.Cart
            .Find(c => c.UserId == userId)
            .FirstOrDefaultAsync();

        if (cart is null ||
            !cart.Items.Any(item => item.ProductId == productId))
        {
            return null;
        }

        var update = Builders<Cart>.Update
            .PullFilter(
                c => c.Items,
                item => item.ProductId == productId)
            .Set(c => c.UpdatedAt, DateTime.UtcNow);

        var result = await _context.Cart.UpdateOneAsync(
            c => c.UserId == userId,
            update);

        if (result.MatchedCount == 0 ||
            result.ModifiedCount == 0)
        {
            return null;
        }

        return await GetCartAsync(userId);
    }

    public async Task<bool> ClearCartAsync(string userId)
    {
        if (!ObjectId.TryParse(userId, out var userObjectId))
            return false;

        var user = await _context.Users
            .Find(u => u.Id == userObjectId && u.IsActive)
            .FirstOrDefaultAsync();

        if (user is null) return false;

        var update = Builders<Cart>.Update
            .Set(c => c.Items, new List<CartItem>())
            .Set(c => c.UpdatedAt, DateTime.UtcNow);

        try
        {
            var result = await _context.Cart.UpdateOneAsync(
                c => c.UserId == userId,
                update);

            return result.MatchedCount > 0;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                "Failed to clear cart.",
                ex);
        }
    }
}