
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
                // A product without a price cannot be purchased.
                if (!product.Price.HasValue || product.Price.Value <= 0)
                    return null;

                var unitPrice = product.Price.Value;
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
                    UnitPrice = unitPrice,
                    Quantity = cartItem.Quantity,
                    LineTotal = unitPrice * cartItem.Quantity
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

    public async Task<Order?> GetOrderByIdAsync(string userId, string orderId)
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

    public async Task<Order?> ConfirmOrderAsync(string orderId)
    {
        if (!ObjectId.TryParse(orderId, out var orderObjectId))
            return null;

        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();

        var committed = false;

        try
        {
            var order = await _context.Order
                .Find(session, o => o.Id == orderObjectId)
                .FirstOrDefaultAsync();

            if (order is null || order.Status != OrderStatus.Pending)
                return null;

            // Convert each reservation into a completed stock deduction.
            foreach (var item in order.Items)
            {
                if (!ObjectId.TryParse(item.ProductId, out var productObjectId))
                    return null;

                var filter = Builders<Inventory>.Filter.And(
                    Builders<Inventory>.Filter.Eq(
                        inventory => inventory.ProductId, productObjectId),
                    Builders<Inventory>.Filter.Gte(
                        inventory => inventory.ReservedQuantity, item.Quantity),
                    Builders<Inventory>.Filter.Gte(
                        inventory => inventory.OnHandQuantity, item.Quantity));

                var update = Builders<Inventory>.Update
                    .Inc(inventory => inventory.OnHandQuantity, -item.Quantity)
                    .Inc(inventory => inventory.ReservedQuantity, -item.Quantity)
                    .Set(inventory => inventory.UpdatedAt, DateTime.UtcNow);

                var result = await _context.Inventory.UpdateOneAsync(
                    session, filter, update);

                if (result.ModifiedCount != 1)
                    return null;
            }

            var orderUpdate = Builders<Order>.Update
                .Set(o => o.Status, OrderStatus.Confirmed)
                .Set(o => o.UpdatedAt, DateTime.UtcNow);

            var orderResult = await _context.Order.UpdateOneAsync(
                session,
                o => o.Id == orderObjectId &&
                o.Status == OrderStatus.Pending,
                orderUpdate);

            if (orderResult.ModifiedCount != 1) return null;

            await session.CommitTransactionAsync();
            committed = true;

            order.Status = OrderStatus.Confirmed;
            order.UpdatedAt = DateTime.UtcNow;

            return order;
        }
        finally
        {
            if (!committed && session.IsInTransaction)
                await session.AbortTransactionAsync();
        }
    }

    public async Task<Order?> CancelOrderAsync(
        string orderId,
        string? requestingUserId = null)
    {
        if (!ObjectId.TryParse(orderId, out var orderObjectId))
            return null;

        using var session = await _context.Client.StartSessionAsync();
        session.StartTransaction();

        var committed = false;

        try
        {
            var filter = Builders<Order>.Filter.And(
                Builders<Order>.Filter.Eq(o => o.Id, orderObjectId),
                Builders<Order>.Filter.In(
                    o => o.Status,
                    new[] { OrderStatus.Pending, OrderStatus.Confirmed }),
                requestingUserId is null
                    ? Builders<Order>.Filter.Empty
                    : Builders<Order>.Filter.Eq(o => o.UserId, requestingUserId));

            var order = await _context.Order
                .Find(session, filter)
                .FirstOrDefaultAsync();

            if (order is null)
                return null;

            foreach (var item in order.Items)
            {
                if (!ObjectId.TryParse(item.ProductId, out var productObjectId))
                    return null;

                var inventoryFilter = Builders<Inventory>.Filter.Eq(inventory => inventory.ProductId, productObjectId);

                var inventoryUpdate =
                    Builders<Inventory>.Update
                        .Set(inventory => inventory.UpdatedAt, DateTime.UtcNow);

                if (order.Status == OrderStatus.Pending)
                {
                    // Stock is reserved but has not been deducted.
                    inventoryFilter = Builders<Inventory>.Filter.And(
                        inventoryFilter,
                        Builders<Inventory>.Filter.Gte(
                            inventory => inventory.ReservedQuantity,
                            item.Quantity));

                    inventoryUpdate = inventoryUpdate.Inc(
                        inventory => inventory.ReservedQuantity,
                        -item.Quantity);
                }
                else if (order.Status == OrderStatus.Confirmed)
                {
                    // Confirmation already deducted the stock.
                    inventoryUpdate = inventoryUpdate.Inc(
                        inventory => inventory.OnHandQuantity,
                        item.Quantity);
                }

                var result = await _context.Inventory.UpdateOneAsync(
                    session,
                    inventoryFilter,
                    inventoryUpdate);

                if (result.ModifiedCount != 1)
                {
                    return null;
                }
            }

            var orderUpdate = Builders<Order>.Update
                .Set(o => o.Status, OrderStatus.Cancelled)
                .Set(o => o.UpdatedAt, DateTime.UtcNow);

            var orderResult = await _context.Order.UpdateOneAsync(
                session,
                o => o.Id == orderObjectId &&
                     o.Status == order.Status,
                orderUpdate);

            if (orderResult.ModifiedCount != 1)
            {
                return null;
            }

            await session.CommitTransactionAsync();
            committed = true;

            order.Status = OrderStatus.Cancelled;
            order.UpdatedAt = DateTime.UtcNow;

            return order;
        }
        finally
        {
            if (!committed && session.IsInTransaction)
                await session.AbortTransactionAsync();
        }
    }
}