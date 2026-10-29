using System.Text;
using backend.Configuration;
using backend.data;
using backend.MiddleWare;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using backend.Authorization;
using backend.Models;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

var mongoSetting = builder.Configuration
    .GetSection("MongoDB")
    .Get<MongoDbSettings>();

// TEMPORARY: Reset an existing admin password in Development only.

// MongoDB configuration
// var mongoSetting = builder.Configuration
//     .GetSection("MongoDB")
//     .Get<MongoDbSettings>();

var jwtSetting = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

// JWT Authentication

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSetting!.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSetting.Audience,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSetting.Key)
            ),

            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

// Authorization
builder.Services.AddAuthorization(option =>
{
    option.AddPolicy("ActiveUser", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.AddRequirements(new ActiveUserRequirement());

    });
});
builder.Services.AddSingleton<IAuthorizationHandler, ActiveUserHandler>();
// CORS configuration
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Dependency Injection
builder.Services.AddSingleton(mongoSetting!);
builder.Services.AddSingleton(jwtSetting!);

builder.Services.AddSingleton<MongoDbContext>();

builder.Services.AddScoped<ProductServices>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<AddressService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<AdminSeeder>();
// Controllers
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    x => x.Key,
                    x => x.Value!.Errors
                        .Select(error => error.ErrorMessage)
                        .ToArray()
                );

            return new BadRequestObjectResult(new
            {
                status = 400,
                message = "Validation failed",
                errors
            });
        };
    });

// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(document =>
        new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer", document)] = []
        });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<MongoDbContext>();

    await dbContext.EnsureIndexesAsync();

    if (app.Environment.IsDevelopment())
    {
        var adminSeeder = scope.ServiceProvider
            .GetRequiredService<AdminSeeder>();

        await adminSeeder.SeedAsync();
    }
}
// Middleware order
app.UseRouting();

app.UseCors("FrontendPolicy");
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();

app.UseAuthorization();


// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Map controllers
app.MapControllers();

app.Run();
