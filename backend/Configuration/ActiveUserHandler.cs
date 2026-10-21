using System.Security.Claims;
using backend.data;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Authorization;

public class ActiveUserHandler : AuthorizationHandler<ActiveUserRequirement>
{
    private readonly MongoDbContext _dbContext;

    public ActiveUserHandler(MongoDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ActiveUserRequirement requirement)
    {
        var userId = context.User.FindFirstValue("sub");

        if (!ObjectId.TryParse(userId, out var objectId))
            return;

        var isActive = await _dbContext.Users
            .Find(user => user.Id == objectId && user.IsActive)
            .AnyAsync();

        if (isActive)
            context.Succeed(requirement);
    }
}

public class ActiveUserRequirement : IAuthorizationRequirement{}