
using backend.data;
using backend.DTOs.Orders;
using backend.Models;
using backend.Models.Orders;
using MongoDB.Bson;
using MongoDB.Driver;

public class OrderService
{
    private readonly MongoDbContext _context;

    public OrderService(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<Order?> CreateOrderAsync(
        string userId,
        OrderRequest request)
    {
        using var session = await _context.Client.StartSessionAsync();

        session.StartTransaction();

        bool transactionCommitted = false;

        try
        {
            if (!ObjectId.TryParse(userId, out var userObjectId) ||
                !ObjectId.TryParse(
                    request.ShippingAddressId,
                    out _))
            {
                return null;
            }

            var user = await _context.Users
                .Find(session, u =>
                    u.Id == userObjectId && u.IsActive)
                .FirstOrDefaultAsync();

            if (user is null)
                return null;

            var address = user.Addresses.FirstOrDefault(
                a => a.Id == request.ShippingAddressId);

            if (address is null)
                return null;

            var cart = await _context.Cart
                .Find(session, c => c.UserId == userId)
                .FirstOrDefaultAsync();

            if (cart is null || cart.Items.Count == 0)
                return null;

            var orderItems = new List<OrderItem>();

            foreach (var cartItem in cart.Items)
            {
                if (cartItem.Quantity <= 0 ||
                    !ObjectId.TryParse(
                        cartItem.ProductId,
                        out var productId))
                {
                    return null;
                }

                // 1. Get the current product details.
                var product = await _context.Products
                    .Find(session, p => p.Id == productId)
                    .FirstOrDefaultAsync();

                if (product is null)
                    return null;

                // 2. Reserve inventory atomically.
                // Available stock = OnHandQuantity - ReservedQuantity.
                var inventoryFilter =
                    Builders<Inventory>.Filter.And(
                        Builders<Inventory>.Filter.Eq(
                            item => item.ProductId,
                            productId),

                        new BsonDocumentFilterDefinition<Inventory>(
                            new BsonDocument(
                                "$expr",
                                new BsonDocument(
                                    "$gte",
                                    new BsonArray
                                    {
                                        new BsonDocument(
                                            "$subtract",
                                            new BsonArray
                                            {
                                                "$OnHandQuantity",
                                                "$ReservedQuantity"
                                            }),

                                        cartItem.Quantity
                                    })))
                    );

                var inventoryUpdate =
                    Builders<Inventory>.Update
                        .Inc(
                            item => item.ReservedQuantity,
                            cartItem.Quantity)
                        .Set(
                            item => item.UpdatedAt,
                            DateTime.UtcNow);

                var inventoryResult =
                    await _context.Inventory.UpdateOneAsync(
                        session,
                        inventoryFilter,
                        inventoryUpdate);

                // No matching inventory means stock is insufficient
                // or inventory has not been initialized.
                if (inventoryResult.ModifiedCount != 1)
                    return null;

                // 3. Snapshot current server-side product details.
                orderItems.Add(new OrderItem
                {
                    ProductId = product.Id.ToString(),
                    ProductTitle = product.Title,
                    Thumbnail = product.Thumbnail,
                    UnitPrice = product.Price,
                    Quantity = cartItem.Quantity,
                    LineTotal = product.Price * cartItem.Quantity
                });
            }

            var subtotal = orderItems.Sum(
                item => item.LineTotal);

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
                Items = orderItems,
                ShippingAddress = shippingAddress,
                Subtotal = subtotal,
                ShippingCost = 0m,
                Total = subtotal,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            // 4. Create the order in the same transaction.
            await _context.Order.InsertOneAsync(
                session,
                order);

            // 5. Clear the cart in the same transaction.
            var cartUpdate = Builders<Cart>.Update
                .Set(c => c.Items, new List<CartItem>())
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            await _context.Cart.UpdateOneAsync(
                session,
                c => c.UserId == userId,
                cartUpdate);

            // 6. Commit all changes together.
            await session.CommitTransactionAsync();

            transactionCommitted = true;

            return order;
        }
        finally
        {
            if (!transactionCommitted &&
                session.IsInTransaction)
            {
                await session.AbortTransactionAsync();
            }
        }
    }

    public async Task<List<Order>> GetOrdersAsync(
        string userId)
    {
        return await _context.Order
            .Find(o => o.UserId == userId)
            .SortByDescending(order => order.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetOrderByIdAsync(
        string userId,
        string orderId)
    {
        if (!ObjectId.TryParse(
                orderId,
                out var orderObjectId))
        {
            return null;
        }

        return await _context.Order
            .Find(o =>
                o.Id == orderObjectId &&
                o.UserId == userId)
            .FirstOrDefaultAsync();
    }
}
