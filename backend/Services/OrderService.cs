using backend.data;
using backend.DTOs.Orders;
using backend.Models.Orders;
using backend.Services;
using MongoDB.Bson;
using MongoDB.Driver;

public class OrderService
{
    private readonly MongoDbContext _context;
    public OrderService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> CreateOrderAsync(string userId, OrderRequest request)
    {
        if (!ObjectId.TryParse(userId, out var userObjectId) || !ObjectId.TryParse(request.ShippingAddressId, out _)) return null;
        var user = await _context.Users.Find(u => u.Id == userObjectId && u.IsActive).FirstOrDefaultAsync();
        if (user is null) return null;
        var address = user.Addresses.FirstOrDefault(a => a.Id == request.ShippingAddressId);
        if (address is null) return null;
        var cart = await _context.Cart.Find(c => c.UserId == userId).FirstOrDefaultAsync();
        if (cart is null || cart.Items.Count == 0) return null;
        var OrderItems = new List<OrderItem>();
        foreach (var cartItem in cart.Items)
        {
            if (cartItem.Quantity <= 0 || !ObjectId.TryParse(cartItem.ProductId, out var productId)) return null;
            var product = await _context.Products.Find(p => p.Id == productId).FirstOrDefaultAsync();
            if (product is null || product.Stock < cartItem.Quantity || product.Stock <= 0) return null;
            OrderItems.Add(new OrderItem
            {
                ProductId = product.Id.ToString(),
                ProductTitle = product.Title,
                Thumbnail = product.Thumbnail,
                UnitPrice = product.Price,
                Quantity = cartItem.Quantity,
                LineTotal = product.Price * cartItem.Quantity
            });
        }
        var subTotal = OrderItems.Sum(item => item.LineTotal);
        var shippingAddress = new ShippingAddress
        {
            FullName = address.FullName,
            Phone = address.Phone,
            AddressLine1 = address.AddressLine1,
            AddressLine2 = address.AddressLine2,
            City = address.City,
            State = address.State,
            PostalCode = address.PostalCode,
            Country = address.Country
        };
        var order = new Order
        {
            UserId = userId,
            Items = OrderItems,
            ShippingAddress = shippingAddress,
            Subtotal = subTotal,
            ShippingCost = 0m,
            Total = subTotal,
            Status = OrderStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        return order;
    }
}