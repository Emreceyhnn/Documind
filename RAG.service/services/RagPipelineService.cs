namespace RAG.Service;

public record IngestResult(Guid DocumentId, int ChunkCount);
public record QueryResult(string Answer, List<SimilarChunkResult> Sources);

public interface IRagPipelineService
{
    Task<IngestResult> IngestDocumentAsync(Guid documentId, Guid companyId, string storageKey, CancellationToken cancellationToken);
    Task<QueryResult> QueryAsync(Guid companyId, string query, int topK, CancellationToken cancellationToken);
    Task<int> DeleteDocumentAsync(Guid documentId, Guid companyId, CancellationToken cancellationToken);
}

public class RagPipelineService : IRagPipelineService
{
    private readonly IStorageReaderService _storageReaderService;
    private readonly IPdfExtractionService _pdfExtractionService;
    private readonly IChunkingService _chunkingService;
    private readonly IEmbeddingService _embeddingService;
    private readonly IVectorSearchService _vectorSearchService;
    private readonly IGenerationService _generationService;
    private readonly ILogger<RagPipelineService> _logger;

    public RagPipelineService(
        IStorageReaderService storageReaderService,
        IPdfExtractionService pdfExtractionService,
        IChunkingService chunkingService,
        IEmbeddingService embeddingService,
        IVectorSearchService vectorSearchService,
        IGenerationService generationService,
        ILogger<RagPipelineService> logger)
    {
        _storageReaderService = storageReaderService;
        _pdfExtractionService = pdfExtractionService;
        _chunkingService = chunkingService;
        _embeddingService = embeddingService;
        _vectorSearchService = vectorSearchService;
        _generationService = generationService;
        _logger = logger;
    }

    public async Task<IngestResult> IngestDocumentAsync(Guid documentId, Guid companyId, string storageKey, CancellationToken cancellationToken)
    {
        using var pdfStream = await _storageReaderService.GetObjectStreamAsync(storageKey, cancellationToken);
        var text = _pdfExtractionService.ExtractText(pdfStream);
        var chunks = _chunkingService.ChunkText(text)
            .Where(chunk => !string.IsNullOrWhiteSpace(chunk))
            .ToList();

        if (chunks.Count == 0)
        {
            _logger.LogWarning("Document {DocumentId} produced no chunks", documentId);
            return new IngestResult(documentId, 0);
        }

        var embeddings = await _embeddingService.GetEmbeddingsAsync(chunks, cancellationToken);
        await _vectorSearchService.StoreChunksAsync(documentId, companyId, chunks, embeddings, cancellationToken);

        _logger.LogInformation("Document {DocumentId} ingested with {ChunkCount} chunks", documentId, chunks.Count);

        return new IngestResult(documentId, chunks.Count);
    }

    public async Task<QueryResult> QueryAsync(Guid companyId, string query, int topK, CancellationToken cancellationToken)
    {
        var queryEmbedding = await _embeddingService.GetEmbeddingAsync(query, cancellationToken);
        var sources = await _vectorSearchService.SearchAsync(companyId, queryEmbedding, topK, cancellationToken);
        var answer = await _generationService.GenerateAnswerAsync(query, sources, cancellationToken);
        return new QueryResult(answer, sources);
    }

    public async Task<int> DeleteDocumentAsync(Guid documentId, Guid companyId, CancellationToken cancellationToken)
    {
        var deletedCount = await _vectorSearchService.DeleteChunksAsync(documentId, companyId, cancellationToken);
        _logger.LogInformation("Document {DocumentId} deleted, {DeletedCount} chunks removed", documentId, deletedCount);
        return deletedCount;
    }
}
