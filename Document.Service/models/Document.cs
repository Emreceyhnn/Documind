namespace Document.Service.Models
{
    public class DocumentEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid CompanyId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string StorageKey { get; set; } = string.Empty;
        public long FileSizeBytes { get; set; }
        public string ContentType { get; set; } = string.Empty;
        public string Status { get; set; } = "processing";
        public DateTime UploadedAt { get; set; }
    }
}