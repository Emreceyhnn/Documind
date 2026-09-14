using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace RAG.Service.Controllers;

public record IngestRequest(Guid DocumentId, string StorageKey);
public record QueryRequest(string Query, int TopK = 5);

[ApiController]
[Route("api/v1/rag")]
[Authorize]
public class RagController : ControllerBase
{
    private readonly IRagPipelineService _ragPipelineService;

    public RagController(IRagPipelineService ragPipelineService)
    {
        _ragPipelineService = ragPipelineService;
    }

    [HttpPost("ingest")]
    public async Task<IActionResult> Ingest([FromBody] IngestRequest request, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyId();

        if (string.IsNullOrWhiteSpace(request.StorageKey))
        {
            return BadRequest(new { error = "StorageKey boş olamaz." });
        }

        var result = await _ragPipelineService.IngestDocumentAsync(request.DocumentId, companyId, request.StorageKey, cancellationToken);

        if (result.ChunkCount == 0)
        {
            return UnprocessableEntity(new { error = "Bu PDF'ten metin çıkarılamadı. Dosya taranmış/görüntü tabanlı olabilir ve metin katmanı içermiyor olabilir." });
        }

        return Ok(result);
    }

    [HttpPost("query")]
    public async Task<IActionResult> Query([FromBody] QueryRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Query))
        {
            return BadRequest(new { error = "Sorgu metni boş olamaz." });
        }

        var companyId = GetCompanyId();
        var result = await _ragPipelineService.QueryAsync(companyId, request.Query, request.TopK, cancellationToken);
        return Ok(result);
    }

    private Guid GetCompanyId()
    {
        var companyIdClaim = User.FindFirstValue("companyId")
            ?? throw new UnauthorizedAccessException("Token içinde şirket id'si bulunamadı.");

        return Guid.Parse(companyIdClaim);
    }
}
