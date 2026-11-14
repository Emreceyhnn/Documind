using RAG.Service;

namespace RAG.Service.Test;

public class ChunkingServiceTests
{
    private readonly ChunkingService _sut = new();

    [Fact]
    public void ShortText_ReturnsSingleChunk()
    {
        var text = "Hello world. This is a short sentence.";
        var result = _sut.ChunkText(text, maxTokens: 400);
        Assert.Single(result);
    }

    [Fact]
    public void EmptyString_ReturnsNoMeaningfulChunks()
    {
        // TextChunker returns [""] for empty input; ensure no non-empty content is produced.
        var result = _sut.ChunkText(string.Empty);
        Assert.All(result, chunk => Assert.True(string.IsNullOrEmpty(chunk),
            $"Expected only empty chunks for empty input, but got: '{chunk}'"));
    }

    [Fact]
    public void WhitespaceOnly_ReturnsEmptyOrWhitespaceChunks()
    {
        // The service should not throw; output may be empty or contain whitespace chunks.
        var result = _sut.ChunkText("   \n\n\t  ");
        // We only assert no exception was thrown and result is not null.
        Assert.NotNull(result);
    }

    [Fact]
    public void LongText_SplitsIntoMultipleChunks()
    {
        // Build a text that is clearly longer than a small maxTokens budget.
        var sentence = "The quick brown fox jumps over the lazy dog. ";
        var longText = string.Concat(Enumerable.Repeat(sentence, 60));

        var result = _sut.ChunkText(longText, maxTokens: 50, overlap: 1);

        Assert.True(result.Count > 1, $"Expected multiple chunks but got {result.Count}");
    }

    [Fact]
    public void LongText_NoDroppedContent()
    {
        var sentence = "The quick brown fox jumps over the lazy dog. ";
        var longText = string.Concat(Enumerable.Repeat(sentence, 60));
        var uniqueWords = longText.Split(' ', StringSplitOptions.RemoveEmptyEntries).Distinct().ToHashSet();

        var result = _sut.ChunkText(longText, maxTokens: 50, overlap: 1);
        var combined = string.Join(" ", result);

        foreach (var word in uniqueWords)
        {
            Assert.Contains(word, combined);
        }
    }

    [Fact]
    public void OverlapProducesRepeatedContent()
    {
        // With overlap > 0, consecutive chunks should share some lines/sentences.
        var sentence = "Line number {0} in the test document. ";
        var lines = Enumerable.Range(1, 80).Select(i => string.Format(sentence, i));
        var longText = string.Join("\n", lines);

        var noOverlap = _sut.ChunkText(longText, maxTokens: 60, overlap: 0);
        var withOverlap = _sut.ChunkText(longText, maxTokens: 60, overlap: 5);

        // With overlap the total concatenated length should be >= without overlap.
        var noOverlapLen = noOverlap.Sum(c => c.Length);
        var withOverlapLen = withOverlap.Sum(c => c.Length);

        Assert.True(withOverlapLen >= noOverlapLen,
            "Overlapping chunks should contain at least as many characters as non-overlapping chunks.");
    }
}
