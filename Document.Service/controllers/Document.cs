using System.Security.Claims;
using Document.Service.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Document.Service.Controllers;

[ApiController]
[Route("api/v1/documents")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpPost("upload")]
    [RequestSizeLimit(50 * 1024 * 1024)] // 50MB — DocumentService'teki limitle tutarlı
    public async Task<IActionResult> Upload(IFormFile file, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var companyId = GetCompanyId();
        var bearerToken = GetBearerToken();

        var result = await _documentService.UploadDocumentAsync(userId, companyId, file, bearerToken, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetMyDocuments(CancellationToken cancellationToken)
    {
        var companyId = GetCompanyId();
        var documents = await _documentService.GetCompanyDocumentsAsync(companyId, cancellationToken);
        return Ok(documents);
    }

    [HttpGet("{id}/download-url")]
    public async Task<IActionResult> GetDownloadUrl(Guid id, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyId();

        var url = await _documentService.GetDownloadUrlAsync(companyId, id, cancellationToken);
        return Ok(new { url });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var companyId = GetCompanyId();
        var bearerToken = GetBearerToken();

        await _documentService.DeleteDocumentAsync(companyId, id, bearerToken, cancellationToken);
        return NoContent();
    }


    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirstValue("userId")
            ?? User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new UnauthorizedAccessException("Token içinde kullanıcı id'si bulunamadı.");

        return Guid.Parse(userIdClaim);
    }

    private Guid GetCompanyId()
    {
        var companyIdClaim = User.FindFirstValue("companyId")
            ?? throw new UnauthorizedAccessException("Token içinde şirket id'si bulunamadı.");

        return Guid.Parse(companyIdClaim);
    }

    private string GetBearerToken()
    {
        var authHeader = Request.Headers.Authorization.ToString();
        return authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? authHeader["Bearer ".Length..]
            : throw new UnauthorizedAccessException("Bearer token bulunamadı.");
    }
}