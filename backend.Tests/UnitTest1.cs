
using System.ComponentModel.DataAnnotations;
using backend.DTOs.Products;
using MongoDB.Bson;
using Xunit;

namespace backend.Tests;

public class UpdateProductRequestTests
{


    [Fact]
    public async Task DeleteProduct_WhenIdIsInvalid_ReturnsInvalidId()
    {
        // Arrange
        var service = new backend.Services.ProductServices(
            context: null!
        );

        // Act
        var result = await service.DeleteProduct("abc");

        // Assert
        Assert.Equal(
            ProductDeleteStatus.InvalidId,
            result.Status
        );
    }


    [Fact]
    public async Task UpdateProductPartial_WhenIdIsInvalid_ReturnsInvalidId()
    {
        // Arrange
        var service = new backend.Services.ProductServices(
            context: null!
        );

        var request = new UpdateProductRequest
        {
            Price = 499.99m
        };

        // Act
        var result = await service.UpdateProductPartial("abc", request);

        // Assert
        Assert.Equal(ProductUpdateStatus.InvalidId, result.Status);
        Assert.False(result.WasModified);
    }

    [Fact]
    public void Validate_WhenPriceIsNegative_ReturnsValidationError()
    {
        var request = new UpdateProductRequest { Price = -1m };
        var results = new List<ValidationResult>();
        var context = new ValidationContext(request);

        var isValid = Validator.TryValidateObject(
            request, context, results, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(UpdateProductRequest.Price)));
    }

    [Fact]
    public void Validate_WhenTitleIsTooShort_ReturnsValidationError()
    {
        var request = new UpdateProductRequest { Title = "A" };
        var results = new List<ValidationResult>();
        var context = new ValidationContext(request);

        var isValid = Validator.TryValidateObject(
            request, context, results, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(UpdateProductRequest.Title)));
    }

    [Fact]
    public void HasUpdates_WhenAllFieldsAreNull_ReturnsFalse()
    {
        var request = new UpdateProductRequest();

        Assert.False(request.HasUpdates());
    }

    [Fact]
    public void HasUpdates_WhenPriceIsProvided_ReturnsTrue()
    {
        var request = new UpdateProductRequest { Price = 499.99m };

        Assert.True(request.HasUpdates());
    }
}

public class CreateProductRequestTests
{
    [Fact]
    public void Validate_WhenPriceIsZero_ReturnsValidationError()
    {
        var request = new CreateProductRequest { Price = 0 };
        var results = new List<ValidationResult>();
        var context = new ValidationContext(request);

        var isValid = Validator.TryValidateObject(
            request, context, results, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(CreateProductRequest.Price)));
    }
}

public class ReplaceProductRequestTests
{
    [Fact]
    public void Validate_WhenPriceIsZero_ReturnsValidationError()
    {
        var request = new ReplaceProductRequest
        {
            Title = "Test Product",
            Description = "A test product description",
            Price = 0,
            DiscountPercentage = 0,
            Category = "electronics",
            Stock = 10,
            Brand = "Test Brand",
            Thumbnail = "https://example.com/product.jpg",
            Images = new List<string>
            {
                "https://example.com/product.jpg"
            }
        };

        var results = new List<ValidationResult>();
        var context = new ValidationContext(request);

        var isValid = Validator.TryValidateObject(
            request, context, results, validateAllProperties: true);

        Assert.False(isValid);
        Assert.Contains(results, result =>
            result.MemberNames.Contains(nameof(ReplaceProductRequest.Price)));
    }
}

public class ProductObjectIdTests
{
    [Fact]
    public void TryParse_WhenIdIsInvalid_ReturnsFalse()
    {
        // Arrange
        var id = "abc";

        // Act
        var isValid = ObjectId.TryParse(id, out _);

        // Assert
        Assert.False(isValid);
    }

    [Fact]
    public void TryParse_WhenIdIsValid_ReturnsTrue()
    {
        // Arrange
        var id = ObjectId.GenerateNewId().ToString();

        // Act
        var isValid = ObjectId.TryParse(id, out _);

        // Assert
        Assert.True(isValid);
    }

    public class ProductServicesTests
    {
        [Fact]
        public async Task GetProductById_WhenIdIsInvalid_ReturnsInvalidId()
        {
            // Arrange
            var service = new backend.Services.ProductServices(
                context: null!
            );

            // Act
            var result = await service.GetProductById("abc");

            // Assert
            Assert.Equal(
                ProductLookupStatus.InvalidId,
                result.Status
            );

            Assert.Null(result.Product);
        }
    }

}
