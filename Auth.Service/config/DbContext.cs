using Microsoft.EntityFrameworkCore;
using Auth.Service.Models;


namespace Auth.Service.Data{
    public class AppDbContext:DbContext{
        public virtual DbSet<User> Users {get;set;}
        public virtual DbSet<Company> Companies {get;set;}
        public virtual DbSet<CompanyInvite> CompanyInvites {get;set;}

        public AppDbContext(DbContextOptions<AppDbContext> options): base(options){}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

            modelBuilder.Entity<Company>(builder =>
            {
                builder.HasOne(c => c.CompanyAdmin)
                    .WithMany()
                    .HasForeignKey(c => c.CompanyAdminId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasMany(c => c.CompanyMembers)
                    .WithOne(u => u.Company)
                    .HasForeignKey(u => u.CompanyId)
                    .OnDelete(DeleteBehavior.Restrict);

                builder.HasMany(c => c.Invites)
                    .WithOne(i => i.Company)
                    .HasForeignKey(i => i.CompanyId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<CompanyInvite>(builder =>
            {
                builder.HasIndex(i => new { i.CompanyId, i.Email }).IsUnique();
            });
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            
            foreach (var entry in ChangeTracker.Entries<User>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
                    
                    entry.Property(nameof(User.CreatedDate)).IsModified = false;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }

}