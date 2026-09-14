using Microsoft.SemanticKernel.Text;

namespace RAG.Service;

public interface IChunkingService
{
    List<string> ChunkText(string fullText, int maxTokens = 400, int overlap = 2);
}

public class ChunkingService : IChunkingService
{
    public List<string> ChunkText(string fullText, int maxTokens = 400, int overlap = 2)
    {
        var lines = TextChunker.SplitPlainTextLines(fullText, maxTokens);
        var paragraphs = TextChunker.SplitPlainTextParagraphs(lines, maxTokens, overlap);
        return paragraphs;
    }
}
