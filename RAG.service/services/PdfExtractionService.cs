using System.Text;
using UglyToad.PdfPig;

namespace RAG.Service;

public interface IPdfExtractionService
{
    string ExtractText(string filePath);
    string ExtractText(Stream pdfStream);
}

public class PdfExtractionService : IPdfExtractionService
{
    private const int MaxPageCount = 2000;

    public string ExtractText(string filePath)
    {
        using var stream = File.OpenRead(filePath);
        return ExtractText(stream);
    }

    public string ExtractText(Stream pdfStream)
    {
        try
        {
            var extractedText = new StringBuilder();
            using (PdfDocument document = PdfDocument.Open(pdfStream))
            {
                if (document.NumberOfPages > MaxPageCount)
                {
                    throw new InvalidOperationException(
                        $"PDF sayfa sayısı ({document.NumberOfPages}) izin verilen limiti ({MaxPageCount}) aşıyor.");
                }

                foreach (var page in document.GetPages())
                {
                    extractedText.Append(page.Text).Append("\n\r");
                }
            }
            return extractedText.ToString();
        }
        catch (Exception ex) when (ex is not InvalidOperationException)
        {
            throw new InvalidOperationException("PDF dosyası okunamadı veya bozuk.", ex);
        }
    }
}
