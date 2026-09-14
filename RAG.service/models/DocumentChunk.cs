using Pgvector;

namespace RAG.Service.Models
{
    public class DocumentChunk
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid DocumentId { get; set; }
        public Guid CompanyId { get; set; }
        public int ChunkIndex { get; set; }
        public string Content { get; set; } = string.Empty;
        public Vector Embedding { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
