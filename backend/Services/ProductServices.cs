using backend.data;
using backend.DTOs.Products;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
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

    public async Task<PaginationResponse> GetProducts([FromQuery] ProductPaginationRequest request)
    {
        var page = request.Page;
        var pageSize = request.PageSize;
        var skip = (page - 1) * pageSize;
        var filter = Builders<Product>.Filter.Empty;

        var Category = request.Category?.Trim().ToLowerInvariant();

        if (!string.IsNullOrWhiteSpace(Category))
        {
            filter &= Builders<Product>.Filter.Eq(
                product => product.Category,
                request.Category
            );
        }
        if (request.MinPrice is not null)
        {
            filter &= Builders<Product>.Filter.Gte(
                product => product.Price,
                request.MinPrice.Value);
        }

        if (request.MaxPrice is not null)
        {
            filter &= Builders<Product>.Filter.Lte(
                product => product.Price,
                request.MaxPrice.Value);
        }
        if (request.MinRating is not null)
        {
            filter &= Builders<Product>.Filter.Gte(
                product => product.Rating,
                request.MinRating.Value);
        }
        var totalProducts = await _context.Products.CountDocumentsAsync(filter);
        var sortOrder = request.SortOrder?.ToLower();
        SortDefinition<Product>? sort = null;
        switch (request.SortBy?.ToLower())
        {
            case "price":
                sort = sortOrder == "desc"
                    ? Builders<Product>.Sort.Descending(product => product.Price)
                    : Builders<Product>.Sort.Ascending(product => product.Price);
                break;

            case "rating":
                sort = sortOrder == "desc"
                    ? Builders<Product>.Sort.Descending(product => product.Rating)
                    : Builders<Product>.Sort.Ascending(product => product.Rating);
                break;

            case "stock":
                sort = sortOrder == "desc"
                    ? Builders<Product>.Sort.Descending(product => product.Stock)
                    : Builders<Product>.Sort.Ascending(product => product.Stock);
                break;

            case "title":
                sort = sortOrder == "desc"
                    ? Builders<Product>.Sort.Descending(product => product.Title)
                    : Builders<Product>.Sort.Ascending(product => product.Title);
                break;
        }
        var query = _context.Products.Find(filter);

        if (sort is not null)
        {
            var combinedSort = Builders<Product>.Sort.Combine(
                sort,
                Builders<Product>.Sort.Ascending(product => product.Id)
            );

            query = query.Sort(combinedSort);
        }
        else
        {
            query = query.Sort(
                Builders<Product>.Sort.Ascending(product => product.Id));
        }
        var products = await query
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

    public async Task<ProductResponse> CreateProduct(Product product)
    {
        await _context.Products.InsertOneAsync(product);
        return MapToResponse(product);
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
    public async Task<ProductUpdateResult> UpdateProductPartial(string id, UpdateProductRequest request)
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
            updates.Add(Builders<Product>.Update.Set(p => p.Title, request.Title));
        if (request.Description is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Description, request.Description));
        if (request.Price is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Price, request.Price.Value));
        if (request.DiscountPercentage is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.DiscountPercentage, request.DiscountPercentage.Value));
        if (request.Category is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Category, request.Category));
        if (request.Stock is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Stock, request.Stock.Value));
        if (request.Brand is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Brand, request.Brand));
        if (request.Thumbnail is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Thumbnail, request.Thumbnail));
        if (request.Images is not null)
            updates.Add(Builders<Product>.Update.Set(p => p.Images, request.Images));

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