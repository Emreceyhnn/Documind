using Document.Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Document.Service.Data{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<DocumentEntity> Documents => Set<DocumentEntity>();
 
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DocumentEntity>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.FileName).IsRequired().HasMaxLength(500);
            entity.Property(d => d.StorageKey).IsRequired().HasMaxLength(1000);
            entity.Property(d => d.ContentType).IsRequired().HasMaxLength(200);
            entity.Property(d => d.Status).IsRequired().HasMaxLength(20);
 
            
            entity.HasIndex(d => new { d.CompanyId, d.Status });
        });
    }
    }
}