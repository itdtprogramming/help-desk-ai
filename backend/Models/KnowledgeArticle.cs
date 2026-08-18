namespace SmartHelpAI.Api.Models;

public class KnowledgeArticle
{
    public string Id { get; set; } = string.Empty; // e.g. KB-0001
    public string Category { get; set; } = string.Empty;

    public string ProblemAr { get; set; } = string.Empty;
    public string ProblemEn { get; set; } = string.Empty;
    public string? ErrorText { get; set; }

    public string RootCauseAr { get; set; } = string.Empty;
    public string RootCauseEn { get; set; } = string.Empty;
    public string SolutionAr { get; set; } = string.Empty;
    public string SolutionEn { get; set; } = string.Empty;

    public string? RelatedPackageId { get; set; }
    public Package? RelatedPackage { get; set; }

    public string ApprovalStatus { get; set; } = "Draft";
    public string EscalationNoteAr { get; set; } = string.Empty;
    public string EscalationNoteEn { get; set; } = string.Empty;

    public int Version { get; set; } = 1;
    public int? ReviewedByUserId { get; set; }
    public User? ReviewedByUser { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewDate { get; set; }

    public ICollection<Ticket> ResolvedTickets { get; set; } = new List<Ticket>();
    public ICollection<RetrievalResult> RetrievalResults { get; set; } = new List<RetrievalResult>();
}
