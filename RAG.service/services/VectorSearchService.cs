using Microsoft.EntityFrameworkCore;
using Pgvector;
using Pgvector.EntityFrameworkCore;
using RAG.Service.Data;
using RAG.Service.Models;

namespace RAG.Service;

public record SimilarChunkResult(Guid DocumentId, int ChunkIndex, string Content, double Similarity);

public interface IVectorSearchService
{
    Task StoreChunksAsync(Guid documentId, Guid companyId, List<string> chunks, List<Vector> embeddings, CancellationToken cancellationToken);
    Task<List<SimilarChunkResult>> SearchAsync(Guid companyId, Vector queryEmbedding, int topK, CancellationToken cancellationToken);
    Task<int> DeleteChunksAsync(Guid documentId, Guid companyId, CancellationToken cancellationToken);
}

public class VectorSearchService : IVectorSearchService
{
    private readonly AppDbContext _dbContext;

    public VectorSearchService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task StoreChunksAsync(Guid documentId, Guid companyId, List<string> chunks, List<Vector> embeddings, CancellationToken cancellationToken)
    {
        if (chunks.Count != embeddings.Count)
        {
            throw new ArgumentException("Chunk sayısı ile embedding sayısı eşleşmiyor.");
        }

        var entities = chunks.Select((content, index) => new DocumentChunk
        {
            DocumentId = documentId,
            CompanyId = companyId,
            ChunkIndex = index,
            Content = content,
            Embedding = embeddings[index]
        });

        _dbContext.DocumentChunks.AddRange(entities);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<SimilarChunkResult>> SearchAsync(Guid companyId, Vector queryEmbedding, int topK, CancellationToken cancellationToken)
    {
        var results = await _dbContext.DocumentChunks
            .Where(c => c.CompanyId == companyId)
            .OrderBy(c => c.Embedding.CosineDistance(queryEmbedding))
            .Take(topK)
            .Select(c => new
            {
                c.DocumentId,
                c.ChunkIndex,
                c.Content,
                Distance = c.Embedding.CosineDistance(queryEmbedding)
            })
            .ToListAsync(cancellationToken);

        return results
            .Select(r => new SimilarChunkResult(r.DocumentId, r.ChunkIndex, r.Content, 1 - r.Distance))
            .ToList();
    }

    public async Task<int> DeleteChunksAsync(Guid documentId, Guid companyId, CancellationToken cancellationToken)
    {
        return await _dbContext.DocumentChunks
            .Where(c => c.DocumentId == documentId && c.CompanyId == companyId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
