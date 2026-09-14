using System.Net;
using Document.Service.Services;

namespace Document.Service.Middleware
{
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
                var (statusCode, message) = ex switch
                {
                    UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
                    DocumentNotFoundException => (HttpStatusCode.NotFound, ex.Message),
                    DocumentValidationException => (HttpStatusCode.BadRequest, ex.Message),
                    ArgumentException => (HttpStatusCode.BadRequest, ex.Message),
                    _ => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
                };

                if (statusCode == HttpStatusCode.InternalServerError)
                {
                    _logger.LogError(ex, "Unhandled exception occurred");
                }

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)statusCode;
                await context.Response.WriteAsJsonAsync(new { success = false, message });
            }
        }
    }
}
