using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Pgvector;

namespace RAG.Service;

public interface IEmbeddingService
{
    Task<Vector> GetEmbeddingAsync(string text, CancellationToken cancellationToken);
    Task<List<Vector>> GetEmbeddingsAsync(List<string> texts, CancellationToken cancellationToken);
}

public class EmbeddingService : IEmbeddingService
{
    private const string Model = "gemini-embedding-001";
    private const int OutputDimensionality = 768;
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly ILogger<EmbeddingService> _logger;

    public EmbeddingService(HttpClient httpClient, IConfiguration configuration, ILogger<EmbeddingService> logger)
    {
        _logger = logger;

        _apiKey = configuration["Gemini:ApiKey"]
            ?? throw new InvalidOperationException("Gemini:ApiKey is missing from configuration.");

        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://generativelanguage.googleapis.com/v1beta/");
    }

    public async Task<Vector> GetEmbeddingAsync(string text, CancellationToken cancellationToken)
    {
        var requestBody = new GeminiEmbedRequest
        {
            Model = $"models/{Model}",
            Content = new GeminiContent
            {
                Parts = new List<GeminiPart> { new() { Text = text } }
            },
            OutputDimensionality = OutputDimensionality
        };

        var requestUri = $"models/{Model}:embedContent?key={_apiKey}";

        using var response = await _httpClient.PostAsJsonAsync(requestUri, requestBody, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Gemini embedding request failed with status {StatusCode}: {Body}", response.StatusCode, errorBody);
            throw new InvalidOperationException($"Embedding sağlayıcısından yanıt alınamadı: {response.StatusCode}");
        }

        var payload = await response.Content.ReadFromJsonAsync<GeminiEmbedResponse>(cancellationToken: cancellationToken)
            ?? throw new InvalidOperationException("Embedding yanıtı çözümlenemedi.");

        return new Vector(payload.Embedding.Values.ToArray());
    }

    private const int MaxConcurrentEmbeddingRequests = 5;

    public async Task<List<Vector>> GetEmbeddingsAsync(List<string> texts, CancellationToken cancellationToken)
    {
        using var semaphore = new SemaphoreSlim(MaxConcurrentEmbeddingRequests);

        var tasks = texts.Select(async text =>
        {
            await semaphore.WaitAsync(cancellationToken);
            try
            {
                return await GetEmbeddingAsync(text, cancellationToken);
            }
            finally
            {
                semaphore.Release();
            }
        });

        var results = await Task.WhenAll(tasks);
        return results.ToList();
    }

    private class GeminiEmbedRequest
    {
        [JsonPropertyName("model")]
        public string Model { get; set; } = string.Empty;

        [JsonPropertyName("content")]
        public GeminiContent Content { get; set; } = new();

        [JsonPropertyName("outputDimensionality")]
        public int OutputDimensionality { get; set; }
    }

    private class GeminiContent
    {
        [JsonPropertyName("parts")]
        public List<GeminiPart> Parts { get; set; } = new();
    }

    private class GeminiPart
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }

    private class GeminiEmbedResponse
    {
        [JsonPropertyName("embedding")]
        public GeminiEmbeddingValues Embedding { get; set; } = new();
    }

    private class GeminiEmbeddingValues
    {
        [JsonPropertyName("values")]
        public List<float> Values { get; set; } = new();
    }
}
