using backend.data;
using backend.DTOs.Orders;
using backend.Models;
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
        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();
        bool transactionCommitted = false;
        try
        {
            if (!ObjectId.TryParse(userId, out var userObjectId) || !ObjectId.TryParse(request.ShippingAddressId, out _)) return null;
            var user = await _context.Users.Find(session, u => u.Id == userObjectId && u.IsActive).FirstOrDefaultAsync();
            if (user is null) return null;
            var address = user.Addresses.FirstOrDefault(a => a.Id == request.ShippingAddressId);
            if (address is null) return null;
            var cart = await _context.Cart.Find(session, c => c.UserId == userId).FirstOrDefaultAsync();
            if (cart is null || cart.Items.Count == 0) return null;
            var OrderItems = new List<OrderItem>();
            foreach (var cartItem in cart.Items)
            {
                if (cartItem.Quantity <= 0 || !ObjectId.TryParse(cartItem.ProductId, out var productId)) return null;
                var product = await _context.Products.Find(session, p => p.Id == productId).FirstOrDefaultAsync();
                if (product is null || product.Stock < cartItem.Quantity || product.Stock <= 0) return null;
                var filter = Builders<Product>.Filter.Where(
                    p => p.Id == productId && p.Stock >= cartItem.Quantity
                );
                var stockupdate = Builders<Product>.Update.Inc(
                    p => p.Stock, -cartItem.Quantity
                );
                var stockresult = await _context.Products.UpdateOneAsync(
                    session,
                    filter,
                    stockupdate
                );
                if (stockresult.ModifiedCount == 0) return null;
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

            await _context.Order.InsertOneAsync(session, order);

            var cartUpdate = Builders<Cart>.Update.Set(c => c.UserId == userId, new());

            await _context.Cart.UpdateOneAsync(session, c => c.UserId == userId, cartUpdate);

            await session.CommitTransactionAsync();
            transactionCommitted = true;
            return order;
        }
        finally
        {
            if (!transactionCommitted && session.IsInTransaction)
            {
                await session.AbortTransactionAsync();
            }
        }
    }

    public async Task<List<Order>> GetOrdersAsync(string userId)
    {
        return await _context.Order
            .Find(o => o.UserId == userId)
            .SortByDescending(order => order.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(string userId,string orderId)
    {
        if(!ObjectId.TryParse(orderId,out var orderObjectId)) return null;
        return await _context.Order.Find(o => o.Id == orderObjectId && o.UserId == userId).FirstOrDefaultAsync();
    } 
}