using Amazon.S3;
using Amazon.S3.Model;

namespace RAG.Service;

public interface IStorageReaderService
{
    Task<Stream> GetObjectStreamAsync(string storageKey, CancellationToken cancellationToken);
}

public class StorageReaderService : IStorageReaderService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public StorageReaderService(IAmazonS3 s3Client, IConfiguration configuration)
    {
        _s3Client = s3Client;
        _bucketName = configuration["Minio:BucketName"]
            ?? throw new InvalidOperationException("Minio:BucketName is missing from configuration.");
    }

    public async Task<Stream> GetObjectStreamAsync(string storageKey, CancellationToken cancellationToken)
    {
        var request = new GetObjectRequest
        {
            BucketName = _bucketName,
            Key = storageKey
        };

        var response = await _s3Client.GetObjectAsync(request, cancellationToken);

        var memoryStream = new MemoryStream();
        await response.ResponseStream.CopyToAsync(memoryStream, cancellationToken);
        memoryStream.Position = 0;
        return memoryStream;
    }
}
