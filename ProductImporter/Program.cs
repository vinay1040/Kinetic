
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using backend.Configuration;
using backend.data;
using backend.Models;
using MongoDB.Driver;
using ProductImporter.DTOs;

// 1. Load the backend MongoDB configuration.
var backendPath = Path.Combine(
    Directory.GetCurrentDirectory(),
    "backend"
);

if (!Directory.Exists(backendPath))
{
    Console.WriteLine("Backend folder not found.");
    return;
}

var configuration = new ConfigurationBuilder()
    .SetBasePath(backendPath)
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile("appsettings.Development.json", optional: true)
    .Build();

var settings = configuration
    .GetSection("MongoDB")
    .Get<MongoDbSettings>();

if (settings is null ||
    string.IsNullOrWhiteSpace(settings.ConnectionString) ||
    string.IsNullOrWhiteSpace(settings.DatabaseName))
{
    Console.WriteLine("MongoDB configuration is incomplete.");
    return;
}

var context = new MongoDbContext(settings);

// 2. Fetch products from electronics categories.
string[] categories =
{
    "laptops",
    "smartphones",
    "tablets",
    "mobile-accessories"
};

using var httpClient = new HttpClient();

var jsonOptions = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};

var sourceProducts = new List<DummyJsonProduct>();

try
{
    foreach (var category in categories)
    {
        var url =
            $"https://dummyjson.com/products/category/{category}?limit=0";

        Console.WriteLine($"Fetching {category}...");

        using var response = await httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        await using var stream =
            await response.Content.ReadAsStreamAsync();

        var result =
            await JsonSerializer.DeserializeAsync<DummyJsonResponse>(
                stream,
                jsonOptions
            );

        if (result is not null)
        {
            sourceProducts.AddRange(result.Products);
            Console.WriteLine(
                $"Received {result.Products.Count} products."
            );
        }
    }

    // 3. Avoid duplicate source IDs in this import batch.
    sourceProducts = sourceProducts
        .GroupBy(product => product.Id)
        .Select(group => group.First())
        .ToList();

    // 4. Read existing source IDs from MongoDB.
    var existingIds = await context.Products
        .Find(product => product.dummyJsonId != null)
        .Project(product => product.dummyJsonId)
        .ToListAsync();

    var existingIdSet = existingIds
        .Where(id => id.HasValue)
        .Select(id => id!.Value)
        .ToHashSet();

    // 5. Convert only missing products to the backend model.
    var productsToInsert = sourceProducts
        .Where(source => !existingIdSet.Contains(source.Id))
        .Select(source => new Product
        {
            dummyJsonId = source.Id,
            tittle = source.Title,
            discription = source.Description,
            price = source.Price,
            category = source.Category,
            stock = source.Stock,
            rating = source.Rating,
            brand = source.Brand,
            images = source.Images,
            thumbnail = source.Thumbnail,
            discountPercentage = source.DiscountPercentage
        })
        .ToList();

    Console.WriteLine(
        $"\nProducts fetched: {sourceProducts.Count}"
    );
    Console.WriteLine(
        $"Already imported: {sourceProducts.Count - productsToInsert.Count}"
    );
    Console.WriteLine(
        $"New products to insert: {productsToInsert.Count}"
    );

    // 6. Insert only missing products.
    if (productsToInsert.Count > 0)
    {
        await context.Products.InsertManyAsync(productsToInsert);
    }

    var finalCount = await context.Products.CountDocumentsAsync(
        FilterDefinition<Product>.Empty
    );

    Console.WriteLine("\nImport finished.");
    Console.WriteLine($"New products inserted: {productsToInsert.Count}");
    Console.WriteLine($"Total products now in MongoDB: {finalCount}");
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"HTTP request failed: {ex.Message}");
}
catch (MongoException ex)
{
    Console.WriteLine($"MongoDB operation failed: {ex.Message}");
}
catch (JsonException ex)
{
    Console.WriteLine($"JSON deserialization failed: {ex.Message}");
}
