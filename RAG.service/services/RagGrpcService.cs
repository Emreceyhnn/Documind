using System.Security.Claims;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using RAG.service.Grpc;

namespace RAG.Service.Services;

[Authorize]
public class RagGrpcService : RagIngest.RagIngestBase
{
    private readonly IRagPipelineService _ragPipelineService;
    private readonly ILogger<RagGrpcService> _logger;

    public RagGrpcService(IRagPipelineService ragPipelineService, ILogger<RagGrpcService> logger)
    {
        _ragPipelineService = ragPipelineService;
        _logger = logger;
    }

    public override async Task<IngestResponse> Ingest(IngestRequest request, ServerCallContext context)
    {
        if (!Guid.TryParse(request.DocumentId, out var documentId))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "documentId geçerli bir GUID değil."));
        }

        if (string.IsNullOrWhiteSpace(request.StorageKey))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "storageKey boş olamaz."));
        }

        var companyId = GetCompanyId(context);

        var result = await _ragPipelineService.IngestDocumentAsync(
            documentId,
            companyId,
            request.StorageKey,
            context.CancellationToken);

        if (result.ChunkCount == 0)
        {
            throw new RpcException(new Status(
                StatusCode.FailedPrecondition,
                "Bu PDF'ten metin çıkarılamadı. Dosya taranmış/görüntü tabanlı olabilir ve metin katmanı içermiyor olabilir."));
        }

        return new IngestResponse
        {
            DocumentId = result.DocumentId.ToString(),
            ChunkCount = result.ChunkCount
        };
    }

    public override async Task<DeleteDocumentResponse> DeleteDocument(DeleteDocumentRequest request, ServerCallContext context)
    {
        if (!Guid.TryParse(request.DocumentId, out var documentId))
        {
            throw new RpcException(new Status(StatusCode.InvalidArgument, "documentId geçerli bir GUID değil."));
        }

        var companyId = GetCompanyId(context);

        var deletedCount = await _ragPipelineService.DeleteDocumentAsync(documentId, companyId, context.CancellationToken);

        return new DeleteDocumentResponse
        {
            DocumentId = documentId.ToString(),
            DeletedChunkCount = deletedCount
        };
    }

    private static Guid GetCompanyId(ServerCallContext context)
    {
        var user = context.GetHttpContext().User;
        var companyIdClaim = user.FindFirstValue("companyId")
            ?? throw new RpcException(new Status(StatusCode.Unauthenticated, "Token içinde şirket id'si bulunamadı."));

        return Guid.Parse(companyIdClaim);
    }
}
