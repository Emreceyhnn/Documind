using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using Auth.Service.Data;
using Auth.Service.Services;
using Auth.Service.Middleware;
using FluentValidation;
using FluentValidation.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var dbSection = builder.Configuration.GetSection("Database");
var dbHost = dbSection["Host"] ?? throw new InvalidOperationException("Database:Host is missing from configuration.");
var dbPort = dbSection["Port"] ?? "5432";
var dbUsername = dbSection["Username"] ?? throw new InvalidOperationException("Database:Username is missing from configuration.");
var dbPassword = dbSection["Password"] ?? throw new InvalidOperationException("Database:Password is missing from configuration.");
var dbName = dbSection["Name"] ?? throw new InvalidOperationException("Database:Name is missing from configuration.");

string connectionString = $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUsername};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});


builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();


var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["SecretKey"] 
    ?? builder.Configuration["JwtSettings:SecretKey"] 
    ?? builder.Configuration["JwtSettings"] 
    ?? throw new InvalidOperationException("JwtSettings:SecretKey is missing.");

var issuer = jwtSection["Issuer"] ?? builder.Configuration["Issuer"] ?? "documind";
var audience = jwtSection["Audience"] ?? builder.Configuration["Audience"] ?? "documind-api";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();


builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("auth", limiterOptions =>
    {
        limiterOptions.PermitLimit = 5; 
        limiterOptions.Window = TimeSpan.FromSeconds(10);
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestTimingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend"); 

app.UseRateLimiter(); 

app.UseAuthentication(); 
app.UseAuthorization();  

app.MapControllers();

app.MapHealthChecks("/health");

app.Run();