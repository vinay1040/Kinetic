using System.Text.RegularExpressions;
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
            Title = product.Title,
            MainCategory = product.MainCategory,
            SubCategory = product.SubCategory,
            Category = product.Category,
            Thumbnail = product.Thumbnail,
            Images = product.Images,
            Price = product.Price,
            OriginalPrice = product.OriginalPrice,
            Rating = product.Rating,
            NumberOfRatings = product.NumberOfRatings,
            ExternalUrl = product.ExternalUrl
        };
    }

    public async Task<PaginationResponse> GetProducts(
        ProductPaginationRequest request)
    {
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var skip = (page - 1) * pageSize;

        var filter = Builders<Product>.Filter.Empty;

        // Multi-category filtering: match any selected category.
        var categories = (request.Categories ?? new List<string>())
            .Where(category => !string.IsNullOrWhiteSpace(category))
            .Select(category => category.Trim())
            .Where(category =>
                !string.Equals(
                    category,
                    "all",
                    StringComparison.OrdinalIgnoreCase))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (categories.Count > 0)
        {
            var categoryFilters = categories.Select(category =>
                Builders<Product>.Filter.Regex(
                    product => product.Category,
                    new BsonRegularExpression(
                        $"^{Regex.Escape(category)}$",
                        "i")));

            filter &= Builders<Product>.Filter.Or(categoryFilters);
        }

        // Search product title and category hierarchy.
        var search = request.Search?.Trim();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchPattern = new BsonRegularExpression(
                Regex.Escape(search),
                "i");

            filter &= Builders<Product>.Filter.Or(
                Builders<Product>.Filter.Regex(
                    product => product.Title, searchPattern),
                Builders<Product>.Filter.Regex(
                    product => product.Category, searchPattern),
                Builders<Product>.Filter.Regex(
                    product => product.MainCategory, searchPattern),
                Builders<Product>.Filter.Regex(
                    product => product.SubCategory, searchPattern));
        }

        if (request.MinPrice.HasValue)
        {
            filter &= Builders<Product>.Filter.Gte(
                product => product.Price,
                request.MinPrice.Value);
        }

        if (request.MaxPrice.HasValue)
        {
            filter &= Builders<Product>.Filter.Lte(
                product => product.Price,
                request.MaxPrice.Value);
        }

        if (request.MinRating.HasValue)
        {
            filter &= Builders<Product>.Filter.Gte(
                product => product.Rating,
                request.MinRating.Value);
        }

        var totalProducts =
            await _context.Products.CountDocumentsAsync(filter);

        var sortOrder = request.SortOrder?.ToLowerInvariant();
        var descending = sortOrder == "desc";

        SortDefinition<Product> sort = request.SortBy?.ToLowerInvariant()
            switch
        {
            "price" => descending
                ? Builders<Product>.Sort.Descending(p => p.Price)
                : Builders<Product>.Sort.Ascending(p => p.Price),

            "rating" => descending
                ? Builders<Product>.Sort.Descending(p => p.Rating)
                : Builders<Product>.Sort.Ascending(p => p.Rating),

            "title" => descending
                ? Builders<Product>.Sort.Descending(p => p.Title)
                : Builders<Product>.Sort.Ascending(p => p.Title),

            _ => Builders<Product>.Sort.Ascending(p => p.Id)
        };

        var products = await _context.Products
            .Find(filter)
            .Sort(sort)
            .Skip(skip)
            .Limit(pageSize)
            .ToListAsync();

        var totalPages = (int)Math.Ceiling(
            (double)totalProducts / pageSize);

        return new PaginationResponse
        {
            Products = products.Select(MapToResponse).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalProducts = totalProducts,
            TotalPages = totalPages
        };
    }

    public async Task<ProductLookupResult> GetProductById(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return new ProductLookupResult
            {
                Status = ProductLookupStatus.InvalidId,
                Product = null
            };
        }

        var product = await _context.Products
            .Find(product => product.Id == objectId)
            .FirstOrDefaultAsync();

        if (product is null)
        {
            return new ProductLookupResult
            {
                Status = ProductLookupStatus.NotFound,
                Product = null
            };
        }

        return new ProductLookupResult
        {
            Status = ProductLookupStatus.Found,
            Product = MapToResponse(product)
        };
    }

    public async Task<List<string>> GetCategories()
    {
        var categories = await _context.Products
            .Distinct<string>(
                new ExpressionFieldDefinition<Product, string>(product => product.Category),
                Builders<Product>.Filter.Empty)
            .ToListAsync();

        return categories
            .Where(category => !string.IsNullOrWhiteSpace(category))
            .OrderBy(category => category)
            .ToList();
    }

    public async Task<ProductResponse> CreateProduct(Product product)
    {
        await _context.Products.InsertOneAsync(product);
        return MapToResponse(product);
    }

    public async Task<bool> UpdateProduct(
        string id,
        Product updatedProduct)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return false;
        }

        var update = Builders<Product>.Update
            .Set(p => p.Title, updatedProduct.Title)
            .Set(p => p.MainCategory, updatedProduct.MainCategory)
            .Set(p => p.SubCategory, updatedProduct.SubCategory)
            .Set(p => p.Category, updatedProduct.Category)
            .Set(p => p.Thumbnail, updatedProduct.Thumbnail)
            .Set(p => p.Images, updatedProduct.Images)
            .Set(p => p.Price, updatedProduct.Price)
            .Set(p => p.OriginalPrice, updatedProduct.OriginalPrice)
            .Set(p => p.Rating, updatedProduct.Rating)
            .Set(p => p.NumberOfRatings, updatedProduct.NumberOfRatings)
            .Set(p => p.ExternalUrl, updatedProduct.ExternalUrl);

        var result = await _context.Products.UpdateOneAsync(
            product => product.Id == objectId,
            update);

        return result.IsAcknowledged && result.MatchedCount > 0;
    }

    public async Task<ProductUpdateResult> UpdateProductPartial(
        string id,
        UpdateProductRequest request)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return new ProductUpdateResult
            {
                Status = ProductUpdateStatus.InvalidId,
                WasModified = false
            };
        }

        var updates = new List<UpdateDefinition<Product>>();

        if (request.Title is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Title, request.Title));

        if (request.MainCategory is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.MainCategory, request.MainCategory));

        if (request.SubCategory is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.SubCategory, request.SubCategory));

        if (request.Category is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Category, request.Category));

        if (request.Thumbnail is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Thumbnail, request.Thumbnail));

        if (request.Images is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Images, request.Images));

        if (request.Price.HasValue)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Price, request.Price.Value));

        if (request.OriginalPrice.HasValue)
            updates.Add(Builders<Product>.Update.Set(
                p => p.OriginalPrice, request.OriginalPrice.Value));

        if (request.Rating.HasValue)
            updates.Add(Builders<Product>.Update.Set(
                p => p.Rating, request.Rating.Value));

        if (request.NumberOfRatings.HasValue)
            updates.Add(Builders<Product>.Update.Set(
                p => p.NumberOfRatings, request.NumberOfRatings.Value));

        if (request.ExternalUrl is not null)
            updates.Add(Builders<Product>.Update.Set(
                p => p.ExternalUrl, request.ExternalUrl));

        if (updates.Count == 0)
        {
            return new ProductUpdateResult
            {
                Status = ProductUpdateStatus.Updated,
                WasModified = false
            };
        }

        var result = await _context.Products.UpdateOneAsync(
            product => product.Id == objectId,
            Builders<Product>.Update.Combine(updates));

        if (result.MatchedCount == 0)
        {
            return new ProductUpdateResult
            {
                Status = ProductUpdateStatus.NotFound,
                WasModified = false
            };
        }

        return new ProductUpdateResult
        {
            Status = ProductUpdateStatus.Updated,
            WasModified = result.ModifiedCount > 0
        };
    }

    public async Task<ProductDeleteResult> DeleteProduct(string id)
    {
        if (!ObjectId.TryParse(id, out var objectId))
        {
            return new ProductDeleteResult
            {
                Status = ProductDeleteStatus.InvalidId
            };
        }

        var result = await _context.Products.DeleteOneAsync(
            product => product.Id == objectId);

        if (result.DeletedCount == 0)
        {
            return new ProductDeleteResult
            {
                Status = ProductDeleteStatus.NotFound
            };
        }

        return new ProductDeleteResult
        {
            Status = ProductDeleteStatus.Deleted
        };
    }
}
