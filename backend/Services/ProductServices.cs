using backend.data;
using backend.DTOs.Products;
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

    private static ProductResponse MapToResponse(Product product)
    {
        return new ProductResponse
        {
            Id = product.Id.ToString(),
            Images = product.Images,
            Thumbnail = product.Thumbnail,
            Title = product.Title,
            Description = product.Description,
            Price = product.Price,
            DiscountPercentage = product.DiscountPercentage,
            Category = product.Category,
            Stock = product.Stock,
            Rating = product.Rating,
            Brand = product.Brand
        };
    }

    public async Task<PaginationResponse> GetProducts(int page, int pageSize)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;

        var skip = (page - 1) * pageSize;
        var totalProducts = await _context.Products.CountDocumentsAsync(_ => true);

        var products = await _context.Products
            .Find(_ => true)
            .Skip(skip)
            .Limit(pageSize)
            .ToListAsync();

        var totalPage = (int)Math.Ceiling((double)totalProducts / pageSize);

        return new PaginationResponse
        {
            Products = products.Select(MapToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalProducts = totalProducts,
            TotalPages = totalPage
        };
    }

    public async Task<ProductResponse?> GetProductById(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return null;
        }

        var product = await _context.Products
            .Find(product => product.Id == objectId)
            .FirstOrDefaultAsync();

        return product is null ? null : MapToResponse(product);
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

        updatedProduct.Id = objectId;

        var update = Builders<Product>.Update
            .Set(product => product.Title, updatedProduct.Title)
            .Set(product => product.Description, updatedProduct.Description)
            .Set(product => product.Price, updatedProduct.Price)
            .Set(product => product.DiscountPercentage, updatedProduct.DiscountPercentage)
            .Set(product => product.Category, updatedProduct.Category)
            .Set(product => product.Stock, updatedProduct.Stock)
            .Set(product => product.Brand, updatedProduct.Brand)
            .Set(product => product.Thumbnail, updatedProduct.Thumbnail)
            .Set(product => product.Images, updatedProduct.Images);

        var result = await _context.Products.UpdateOneAsync(
            product => product.Id == objectId,
            update);

        return result.IsAcknowledged && result.MatchedCount > 0;
    }

    public async Task<bool> DeleteProduct(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId)) return false;

        var result = await _context.Products.DeleteOneAsync(product => product.Id == objectId);
        return result.DeletedCount > 0;
    }
}