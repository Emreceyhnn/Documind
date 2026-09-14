using System.Diagnostics;

namespace Auth.Service.Middleware
{
    public class RequestTimingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestTimingMiddleware> _logger;

        public RequestTimingMiddleware(RequestDelegate next,ILogger<RequestTimingMiddleware> logger)
        {
            _next=next;
            _logger=logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopWatch = Stopwatch.StartNew();
            var requestPath = context.Request.Path;
            var requestMethod = context.Request.Method;

            _logger.LogInformation("Request {Method} {Path} starts at {DateTime}", requestMethod,requestPath,DateTime.UtcNow);

            context.Response.OnStarting(()=>
            {
                stopWatch.Stop();
                var elapsed = stopWatch.ElapsedMilliseconds;

                context.Response.Headers["X-Response-Time-ms"] = elapsed.ToString();
                
                if(elapsed > 500)
                {
                    _logger.LogWarning("Request {Method} {Path} took {Elapsed}ms which is slow", requestMethod,requestPath,elapsed);
                }
                return Task.CompletedTask;
            });

            try{
                await _next(context);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex,"Request {Method} {Path} failed",requestMethod,requestPath);
                throw;
            }

            finally{
                if(stopWatch.IsRunning)
                {
                    stopWatch.Stop();
                }
                _logger.LogInformation("Request {Method} {Path} finished at {DateTime} took {Elapsed}ms",
                    requestMethod,requestPath,DateTime.UtcNow,stopWatch.ElapsedMilliseconds);
            }
            
        }
    }
}