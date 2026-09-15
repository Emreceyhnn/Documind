using Amazon.S3;
using Amazon.S3.Model;

namespace Document.Service.Services;

public interface IStorageService
{
    Task<string> UploadAsync(Stream fileStream, string storageKey, string contentType, CancellationToken cancellationToken);
    Task<string> GetPresignedDownloadUrlAsync(string storageKey, TimeSpan expiry);
    Task DeleteAsync(string storageKey, CancellationToken cancellationToken);
}

public class MinioStorageService : IStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly bool _serviceUrlIsHttp;
    private readonly ILogger<MinioStorageService> _logger;

    public MinioStorageService(IAmazonS3 s3Client, IConfiguration configuration, ILogger<MinioStorageService> logger)
    {
        _s3Client = s3Client;
        _logger = logger;
        _bucketName = configuration["Minio:BucketName"]
            ?? throw new InvalidOperationException("Minio:BucketName is missing from configuration.");
        _serviceUrlIsHttp = (configuration["Minio:ServiceUrl"] ?? string.Empty).StartsWith("http://");
    }

    public async Task<string> UploadAsync(Stream fileStream, string storageKey, string contentType, CancellationToken cancellationToken)
    {
        try
        {
            var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _bucketName);
            if (!bucketExists)
            {
                _logger.LogInformation("Creating MinIO bucket {BucketName}", _bucketName);
                await _s3Client.PutBucketAsync(new PutBucketRequest { BucketName = _bucketName }, cancellationToken);
            }

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = storageKey,
                InputStream = fileStream,
                ContentType = contentType,
                AutoCloseStream = true
            };

            await _s3Client.PutObjectAsync(request, cancellationToken);
            return storageKey;
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "MinIO upload failed for key {StorageKey}", storageKey);
            throw;
        }
    }

    public Task<string> GetPresignedDownloadUrlAsync(string storageKey, TimeSpan expiry)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = storageKey,
            Expires = DateTime.UtcNow.Add(expiry),
            Verb = HttpVerb.GET,
            Protocol = _serviceUrlIsHttp ? Protocol.HTTP : Protocol.HTTPS
        };

        var url = _s3Client.GetPreSignedURL(request);
        return Task.FromResult(url);
    }

    public async Task DeleteAsync(string storageKey, CancellationToken cancellationToken)
    {
        try
        {
            await _s3Client.DeleteObjectAsync(_bucketName, storageKey, cancellationToken);
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "MinIO delete failed for key {StorageKey}", storageKey);
            throw;
        }
    }
}