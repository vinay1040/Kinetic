namespace backend.MiddleWare;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
            _logger.LogError(
                ex,
                "An unhandled exception occurred while processing {Method} {Path}",
                context.Request.Method,
                context.Request.Path
            );
        }
    }
    public static async Task HandleExceptionAsync(
    HttpContext context,
    Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            ArgumentException =>
                (StatusCodes.Status400BadRequest, "Invalid request."),

            KeyNotFoundException =>
                (StatusCodes.Status404NotFound, "Resource not found."),

            InvalidOperationException =>
                (StatusCodes.Status409Conflict, exception.Message),

            _ =>
                (StatusCodes.Status500InternalServerError,
                 "An unexpected error occurred.")
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new
        {
            status = statusCode,
            message
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}
