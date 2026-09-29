using backend.data;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services;

public class ProductServices
{
    private readonly MongoDbContext _context;

    public ProductServices(MongoDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetProducts()
    {
        return await _context.Products
            .Find(_ => true)
            .ToListAsync();
    }

    public async Task<Product?> GetProductById(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId)) return null;
        return await _context.Products
            .Find(product => product.id == MongoDB.Bson.ObjectId.Parse(id))
            .FirstOrDefaultAsync();
    }

    public async Task CreateProduct(Product product)
    {
        await _context.Products.InsertOneAsync(product);
    }

    public async Task<bool> UpdateProduct(string id, Product updatedProduct)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return false;
        }

        updatedProduct.id = objectId;

        var result = await _context.Products.ReplaceOneAsync(
            product => product.id == objectId,
            updatedProduct);

        return result.IsAcknowledged && result.MatchedCount > 0;
    }
    public async Task<bool> DeleteProduct(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId)) return false;
        var result = await _context.Products.DeleteOneAsync(product => product.id == MongoDB.Bson.ObjectId.Parse(id));
        return result.DeletedCount > 0;
    }

}