using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using Pgvector;
using RAG.Service;

namespace RAG.Service.Test;

public class RagPipelineServiceTests
{
    private readonly Mock<IStorageReaderService> _storageMock = new();
    private readonly Mock<IPdfExtractionService> _pdfMock = new();
    private readonly Mock<IChunkingService> _chunkingMock = new();
    private readonly Mock<IEmbeddingService> _embeddingMock = new();
    private readonly Mock<IVectorSearchService> _vectorMock = new();
    private readonly Mock<IGenerationService> _generationMock = new();
    private readonly RagPipelineService _sut;

    public RagPipelineServiceTests()
    {
        _sut = new RagPipelineService(
            _storageMock.Object,
            _pdfMock.Object,
            _chunkingMock.Object,
            _embeddingMock.Object,
            _vectorMock.Object,
            _generationMock.Object,
            NullLogger<RagPipelineService>.Instance);
    }

    [Fact]
    public async Task IngestDocument_ReturnsCorrectChunkCount()
    {
        var docId = Guid.NewGuid();
        var companyId = Guid.NewGuid();
        var stream = new MemoryStream();
        var chunks = new List<string> { "chunk one", "chunk two", "chunk three" };
        var vectors = chunks.Select(_ => new Vector(new float[] { 0.1f, 0.2f })).ToList();

        _storageMock.Setup(s => s.GetObjectStreamAsync("key", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stream);
        _pdfMock.Setup(p => p.ExtractText(stream)).Returns("some extracted text");
        _chunkingMock.Setup(c => c.ChunkText("some extracted text", It.IsAny<int>(), It.IsAny<int>()))
            .Returns(chunks);
        _embeddingMock.Setup(e => e.GetEmbeddingsAsync(chunks, It.IsAny<CancellationToken>()))
            .ReturnsAsync(vectors);
        _vectorMock.Setup(v => v.StoreChunksAsync(docId, companyId, chunks, vectors, It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        var result = await _sut.IngestDocumentAsync(docId, companyId, "key", CancellationToken.None);

        Assert.Equal(docId, result.DocumentId);
        Assert.Equal(3, result.ChunkCount);
    }

    [Fact]
    public async Task IngestDocument_AllWhitespaceChunks_ReturnsZeroChunks()
    {
        var docId = Guid.NewGuid();
        var companyId = Guid.NewGuid();
        var stream = new MemoryStream();

        _storageMock.Setup(s => s.GetObjectStreamAsync("key", It.IsAny<CancellationToken>()))
            .ReturnsAsync(stream);
        _pdfMock.Setup(p => p.ExtractText(stream)).Returns("   ");
        _chunkingMock.Setup(c => c.ChunkText("   ", It.IsAny<int>(), It.IsAny<int>()))
            .Returns(new List<string> { "  ", "\t" });

        var result = await _sut.IngestDocumentAsync(docId, companyId, "key", CancellationToken.None);

        Assert.Equal(0, result.ChunkCount);
        _embeddingMock.Verify(e => e.GetEmbeddingsAsync(It.IsAny<List<string>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task QueryAsync_ReturnsAnswerAndSources()
    {
        var companyId = Guid.NewGuid();
        var queryVec = new Vector(new float[] { 0.1f });
        var sources = new List<SimilarChunkResult>
        {
            new(Guid.NewGuid(), 0, "relevant chunk", 0.95)
        };

        _embeddingMock.Setup(e => e.GetEmbeddingAsync("test query", It.IsAny<CancellationToken>()))
            .ReturnsAsync(queryVec);
        _vectorMock.Setup(v => v.SearchAsync(companyId, queryVec, 5, It.IsAny<CancellationToken>()))
            .ReturnsAsync(sources);
        _generationMock.Setup(g => g.GenerateAnswerAsync("test query", sources, It.IsAny<CancellationToken>()))
            .ReturnsAsync("generated answer");

        var result = await _sut.QueryAsync(companyId, "test query", 5, CancellationToken.None);

        Assert.Equal("generated answer", result.Answer);
        Assert.Single(result.Sources);
    }

    [Fact]
    public async Task DeleteDocumentAsync_ReturnsDelegatedCount()
    {
        var docId = Guid.NewGuid();
        var companyId = Guid.NewGuid();

        _vectorMock.Setup(v => v.DeleteChunksAsync(docId, companyId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(7);

        var count = await _sut.DeleteDocumentAsync(docId, companyId, CancellationToken.None);

        Assert.Equal(7, count);
    }
}
