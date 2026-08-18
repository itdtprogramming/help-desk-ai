using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<TicketStatusHistory> TicketStatusHistories => Set<TicketStatusHistory>();
    public DbSet<TicketComment> TicketComments => Set<TicketComment>();
    public DbSet<KnowledgeArticle> KnowledgeArticles => Set<KnowledgeArticle>();
    public DbSet<Package> Packages => Set<Package>();
    public DbSet<TicketClassificationLog> TicketClassificationLogs => Set<TicketClassificationLog>();
    public DbSet<RetrievalLog> RetrievalLogs => Set<RetrievalLog>();
    public DbSet<RetrievalResult> RetrievalResults => Set<RetrievalResult>();
    public DbSet<ChatSession> ChatSessions => Set<ChatSession>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasIndex(t => t.DisplayCode)
            .IsUnique();

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.ReportedByUser)
            .WithMany(u => u.ReportedTickets)
            .HasForeignKey(t => t.ReportedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedTechnician)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.AssignedTechnicianId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.RelatedKnowledgeArticle)
            .WithMany(k => k.ResolvedTickets)
            .HasForeignKey(t => t.RelatedKnowledgeArticleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TicketStatusHistory>()
            .HasOne(h => h.Ticket)
            .WithMany(t => t.StatusHistory)
            .HasForeignKey(h => h.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TicketStatusHistory>()
            .HasOne(h => h.ChangedByUser)
            .WithMany()
            .HasForeignKey(h => h.ChangedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.Ticket)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.AuthorUser)
            .WithMany()
            .HasForeignKey(c => c.AuthorUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<KnowledgeArticle>()
            .HasOne(k => k.RelatedPackage)
            .WithMany(p => p.KnowledgeArticles)
            .HasForeignKey(k => k.RelatedPackageId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<KnowledgeArticle>()
            .HasOne(k => k.ReviewedByUser)
            .WithMany()
            .HasForeignKey(k => k.ReviewedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TicketClassificationLog>()
            .HasOne(c => c.Ticket)
            .WithMany(t => t.ClassificationLogs)
            .HasForeignKey(c => c.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TicketClassificationLog>()
            .HasOne(c => c.OverriddenByUser)
            .WithMany()
            .HasForeignKey(c => c.OverriddenByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<RetrievalLog>()
            .HasOne(r => r.Ticket)
            .WithMany(t => t.RetrievalLogs)
            .HasForeignKey(r => r.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RetrievalResult>()
            .HasOne(r => r.RetrievalLog)
            .WithMany(l => l.Results)
            .HasForeignKey(r => r.RetrievalLogId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<RetrievalResult>()
            .HasOne(r => r.KnowledgeArticle)
            .WithMany(k => k.RetrievalResults)
            .HasForeignKey(r => r.KnowledgeArticleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatSession>()
            .HasOne(s => s.Ticket)
            .WithOne(t => t.ChatSession)
            .HasForeignKey<ChatSession>(s => s.TicketId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatSession>()
            .HasOne(s => s.User)
            .WithMany()
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ChatMessage>()
            .HasOne(m => m.ChatSession)
            .WithMany(s => s.Messages)
            .HasForeignKey(m => m.ChatSessionId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "Technician" },
            new Role { Id = 3, Name = "User" }
        );
    }
}
