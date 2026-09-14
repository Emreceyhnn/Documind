using Microsoft.EntityFrameworkCore;
using RAG.Service.Models;

namespace RAG.Service.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<DocumentChunk> DocumentChunks => Set<DocumentChunk>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("vector");

            modelBuilder.Entity<DocumentChunk>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Content).IsRequired();
                entity.Property(c => c.Embedding).HasColumnType("vector(768)");

                entity.HasIndex(c => c.DocumentId);
                entity.HasIndex(c => c.CompanyId);

                entity.HasIndex(c => c.Embedding)
                    .HasMethod("hnsw")
                    .HasOperators("vector_cosine_ops");
            });
        }
    }
}
