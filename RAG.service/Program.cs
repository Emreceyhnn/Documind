using System.Text;
using Amazon.Runtime;
using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RAG.Service;
using RAG.Service.Data;
using RAG.Service.Services;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5110, o => o.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http1);
    options.ListenAnyIP(5111, o => o.Protocols = Microsoft.AspNetCore.Server.Kestrel.Core.HttpProtocols.Http2);
});

var dbConfig = builder.Configuration.GetSection("Database");
var connectionString = $"Host={dbConfig["Host"]};Port={dbConfig["Port"]};Database={dbConfig["Name"]};Username={dbConfig["Username"]};Password={dbConfig["Password"]}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, o => o.UseVector()));

var minioConfig = builder.Configuration.GetSection("Minio");
builder.Services.AddSingleton<IAmazonS3>(_ => new AmazonS3Client(
    new BasicAWSCredentials(minioConfig["AccessKey"], minioConfig["SecretKey"]),
    new AmazonS3Config
    {
        ServiceURL = minioConfig["ServiceUrl"],
        ForcePathStyle = true,
        UseHttp = minioConfig["ServiceUrl"]?.StartsWith("http://") ?? false
    }));

builder.Services.AddScoped<IStorageReaderService, StorageReaderService>();
builder.Services.AddScoped<IPdfExtractionService, PdfExtractionService>();
builder.Services.AddScoped<IChunkingService, ChunkingService>();
builder.Services.AddHttpClient<IEmbeddingService, EmbeddingService>();
builder.Services.AddHttpClient<IGenerationService, GenerationService>();
builder.Services.AddScoped<IVectorSearchService, VectorSearchService>();
builder.Services.AddScoped<IRagPipelineService, RagPipelineService>();

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

builder.Services.AddGrpc();

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

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapGrpcService<RagGrpcService>();

app.Run();
