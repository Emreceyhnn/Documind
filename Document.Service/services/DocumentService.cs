using Document.Service.Data;
using Document.Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Document.Service.Services
{
    public record UploadDocumentResult(Guid DocumentId, string FileName, string Status);

    public interface IDocumentService
    {
        Task<UploadDocumentResult> UploadDocumentAsync(Guid userId, Guid companyId, IFormFile file, string bearerToken, CancellationToken cancellationToken);
        Task<List<DocumentEntity>> GetCompanyDocumentsAsync(Guid companyId, CancellationToken cancellationToken);
        Task<string> GetDownloadUrlAsync(Guid companyId, Guid documentId, CancellationToken cancellationToken);
        Task DeleteDocumentAsync(Guid companyId, Guid documentId, string bearerToken, CancellationToken cancellationToken);
    }

    public class DocumentValidationException : Exception
    {
        public DocumentValidationException(string message) : base(message) { }
    }

    public class DocumentNotFoundException : Exception
    {
        public DocumentNotFoundException(string message) : base(message) { }
    }

    public class DocumentService : IDocumentService
    {
        private static readonly Dictionary<string, byte[]> MagicNumbers = new(StringComparer.OrdinalIgnoreCase)
        {
            ["application/pdf"] = new byte[] { 0x25, 0x50, 0x44, 0x46 }, // %PDF
            ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
                = new byte[] { 0x50, 0x4B, 0x03, 0x04 } // PK.. (zip/docx container)
        };

        private static readonly Dictionary<string, string> ExtensionsByContentType = new(StringComparer.OrdinalIgnoreCase)
        {
            ["application/pdf"] = ".pdf",
            ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = ".docx"
        };

        private const long MaxFileSizeBytes = 50 * 1024 * 1024;

        private readonly AppDbContext _dbContext;
        private readonly IStorageService _storageService;
        private readonly IRagClientService _ragClientService;
        private readonly ILogger<DocumentService> _logger;

        public DocumentService(AppDbContext dbContext, IStorageService storageService, IRagClientService ragClientService, ILogger<DocumentService> logger)
        {
            _dbContext = dbContext;
            _storageService = storageService;
            _ragClientService = ragClientService;
            _logger = logger;
        }

        public async Task<UploadDocumentResult> UploadDocumentAsync(Guid userId, Guid companyId, IFormFile file, string bearerToken, CancellationToken cancellationToken)
        {
            await ValidateFileAsync(file, cancellationToken);

            var documentId = Guid.NewGuid();
            var extension = ExtensionsByContentType[file.ContentType];
            var storageKey = $"{companyId}/{documentId}{extension}";

            await using (var stream = file.OpenReadStream())
            {
                await _storageService.UploadAsync(stream, storageKey, file.ContentType, cancellationToken);
            }

            var entity = new DocumentEntity
            {
                Id = documentId,
                UserId = userId,
                CompanyId = companyId,
                FileName = SanitizeFileName(file.FileName),
                StorageKey = storageKey,
                FileSizeBytes = file.Length,
                ContentType = file.ContentType,
                Status = "processing",
                UploadedAt = DateTime.UtcNow
            };

            try
            {
                _dbContext.Documents.Add(entity);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }
            catch
            {
                // DB kaydı oluşturulamadıysa storage'da orphan dosya bırakmamak için telafi et.
                await TryDeleteStorageObjectAsync(storageKey, cancellationToken);
                throw;
            }

            _logger.LogInformation("Document {DocumentId} uploaded by user {UserId}", documentId, userId);

            if (file.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
            {
                var ingestSucceeded = await _ragClientService.IngestDocumentAsync(documentId, storageKey, bearerToken, cancellationToken);
                entity.Status = ingestSucceeded ? "ready" : "error";
            }
            else
            {
                entity.Status = "ready";
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            return new UploadDocumentResult(entity.Id, entity.FileName, entity.Status);
        }

        private async Task TryDeleteStorageObjectAsync(string storageKey, CancellationToken cancellationToken)
        {
            try
            {
                await _storageService.DeleteAsync(storageKey, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to compensate storage upload for key {StorageKey}", storageKey);
            }
        }

        public async Task<List<DocumentEntity>> GetCompanyDocumentsAsync(Guid companyId, CancellationToken cancellationToken)
        {
            return await _dbContext.Documents.AsNoTracking()
                .Where(d => d.CompanyId == companyId)
                .OrderByDescending(d => d.UploadedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<string> GetDownloadUrlAsync(Guid companyId, Guid documentId, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Documents.AsNoTracking()
                .FirstOrDefaultAsync(d => d.Id == documentId && d.CompanyId == companyId, cancellationToken);

            if (entity == null)
            {
                throw new DocumentNotFoundException("Doküman bulunamadı.");
            }

            return await _storageService.GetPresignedDownloadUrlAsync(entity.StorageKey, TimeSpan.FromMinutes(10));
        }

        public async Task DeleteDocumentAsync(Guid companyId, Guid documentId, string bearerToken, CancellationToken cancellationToken)
        {
            var entity = await _dbContext.Documents
                .FirstOrDefaultAsync(d => d.Id == documentId && d.CompanyId == companyId, cancellationToken);

            if (entity == null)
            {
                throw new DocumentNotFoundException("Doküman bulunamadı.");
            }

            if (entity.ContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase))
            {
                await _ragClientService.DeleteDocumentAsync(documentId, bearerToken, cancellationToken);
            }

            await _storageService.DeleteAsync(entity.StorageKey, cancellationToken);

            _dbContext.Documents.Remove(entity);
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Document {DocumentId} deleted", documentId);
        }

        private static async Task ValidateFileAsync(IFormFile file, CancellationToken cancellationToken)
        {
            if (file.Length == 0)
            {
                throw new DocumentValidationException("Dosya boş olamaz.");
            }

            if (file.Length > MaxFileSizeBytes)
            {
                throw new DocumentValidationException($"Dosya boyutu {MaxFileSizeBytes / (1024 * 1024)}MB limitini aşıyor.");
            }

            if (!MagicNumbers.TryGetValue(file.ContentType, out var expectedMagic))
            {
                throw new DocumentValidationException("Sadece PDF ve DOCX dosyaları kabul edilir.");
            }

            var buffer = new byte[expectedMagic.Length];
            await using var stream = file.OpenReadStream();
            var bytesRead = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length), cancellationToken);
            stream.Position = 0;

            if (bytesRead < expectedMagic.Length || !buffer.SequenceEqual(expectedMagic))
            {
                throw new DocumentValidationException("Dosya içeriği belirtilen türle uyuşmuyor.");
            }
        }

        private static string SanitizeFileName(string fileName)
        {
            var name = Path.GetFileName(fileName);
            foreach (var invalidChar in Path.GetInvalidFileNameChars())
            {
                name = name.Replace(invalidChar, '_');
            }
            return name;
        }
    }
}