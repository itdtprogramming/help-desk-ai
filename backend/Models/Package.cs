namespace SmartHelpAI.Api.Models;

// Metadata-only approved-package catalog (no stock/quantity tracking — that is a
// Phase 4 / production-scope extension, not part of the sprint MVP).
public class Package
{
    public string Id { get; set; } = string.Empty; // e.g. PKG-0041
    public string Name { get; set; } = string.Empty;
    public string VersionLabel { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string Sha256Hash { get; set; } = string.Empty;
    public string ApprovalStatus { get; set; } = "Approved";
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<KnowledgeArticle> KnowledgeArticles { get; set; } = new List<KnowledgeArticle>();
}
