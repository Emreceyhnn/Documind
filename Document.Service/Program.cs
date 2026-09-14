using System.Text;
using Amazon.Runtime;
using Amazon.S3;
using Document.Service.Data;
using Document.Service.Middleware;
using Document.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var dbConfig = builder.Configuration.GetSection("Database");
var connectionString = $"Host={dbConfig["Host"]};Port={dbConfig["Port"]};Database={dbConfig["Name"]};Username={dbConfig["Username"]};Password={dbConfig["Password"]}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var minioConfig = builder.Configuration.GetSection("Minio");
builder.Services.AddSingleton<IAmazonS3>(_ => new AmazonS3Client(
    new BasicAWSCredentials(minioConfig["AccessKey"], minioConfig["SecretKey"]),
    new AmazonS3Config
    {
        ServiceURL = minioConfig["ServiceUrl"],
        ForcePathStyle = true,
        UseHttp = minioConfig["ServiceUrl"]?.StartsWith("http://") ?? false
    }));

builder.Services.AddScoped<IStorageService, MinioStorageService>();
builder.Services.AddSingleton<IRagClientService, RagClientService>();
builder.Services.AddScoped<IDocumentService, Document.Service.Services.DocumentService>();

var jwtConfig = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["SecretKey"]!))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers();

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
