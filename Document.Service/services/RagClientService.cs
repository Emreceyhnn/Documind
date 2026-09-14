using Grpc.Core;
using Grpc.Net.Client;
using RAG.service.Grpc;

namespace Document.Service.Services;

public interface IRagClientService
{
    Task<bool> IngestDocumentAsync(Guid documentId, string storageKey, string bearerToken, CancellationToken cancellationToken);
    Task<bool> DeleteDocumentAsync(Guid documentId, string bearerToken, CancellationToken cancellationToken);
}

public class RagClientService : IRagClientService
{
    private readonly GrpcChannel _channel;
    private readonly ILogger<RagClientService> _logger;

    public RagClientService(IConfiguration configuration, ILogger<RagClientService> logger)
    {
        _logger = logger;

        var ragGrpcUrl = configuration["Rag:GrpcUrl"]
            ?? throw new InvalidOperationException("Rag:GrpcUrl is missing from configuration.");

        AppContext.SetSwitch("System.Net.Http.SocketsHttpHandler.Http2UnencryptedSupport", true);

        _channel = GrpcChannel.ForAddress(ragGrpcUrl);
    }

    public async Task<bool> IngestDocumentAsync(Guid documentId, string storageKey, string bearerToken, CancellationToken cancellationToken)
    {
        try
        {
            var client = new RagIngest.RagIngestClient(_channel);

            var request = new IngestRequest
            {
                DocumentId = documentId.ToString(),
                StorageKey = storageKey
            };

            var headers = new Metadata
            {
                { "Authorization", $"Bearer {bearerToken}" }
            };

            var response = await client.IngestAsync(request, headers, cancellationToken: cancellationToken);

            return response.ChunkCount > 0;
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "RAG ingest request failed for document {DocumentId} with status {StatusCode}", documentId, ex.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "RAG ingest request failed for document {DocumentId}", documentId);
            return false;
        }
    }

    public async Task<bool> DeleteDocumentAsync(Guid documentId, string bearerToken, CancellationToken cancellationToken)
    {
        try
        {
            var client = new RagIngest.RagIngestClient(_channel);

            var request = new DeleteDocumentRequest
            {
                DocumentId = documentId.ToString()
            };

            var headers = new Metadata
            {
                { "Authorization", $"Bearer {bearerToken}" }
            };

            await client.DeleteDocumentAsync(request, headers, cancellationToken: cancellationToken);

            return true;
        }
        catch (RpcException ex)
        {
            _logger.LogError(ex, "RAG delete request failed for document {DocumentId} with status {StatusCode}", documentId, ex.StatusCode);
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "RAG delete request failed for document {DocumentId}", documentId);
            return false;
        }
    }
}
