namespace SmartHelpAI.Api.Models;

public static class TicketCategory
{
    public const string Software = "Software";
    public const string Hardware = "Hardware";
    public const string Network = "Network";
    public const string Account = "Account";
}

public static class TicketStatus
{
    public const string New = "New";
    public const string InProgress = "InProgress";
    public const string Escalated = "Escalated";
    public const string Resolved = "Resolved";
    public const string Closed = "Closed";
}

public static class ResolutionSource
{
    public const string SelfService = "SelfService";
    public const string Chatbot = "Chatbot";
    public const string Technician = "Technician";
}

public class Ticket
{
    public int Id { get; set; }
    public string DisplayCode { get; set; } = string.Empty;

    public int ReportedByUserId { get; set; }
    public User? ReportedByUser { get; set; }

    public int? AssignedTechnicianId { get; set; }
    public User? AssignedTechnician { get; set; }

    public string ProblemDescription { get; set; } = string.Empty;
    public string? ErrorMessage { get; set; }

    // Confirmed/ground-truth category (set by reporter or overridden by a technician)
    public string Category { get; set; } = string.Empty;

    // What the AI classifier predicted — kept separate from Category so override rate is measurable
    public string? PredictedCategory { get; set; }
    public double? PredictionConfidence { get; set; }

    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = TicketStatus.New;

    public string? RootCause { get; set; }
    public string? ActualSolution { get; set; }
    public bool? ResolvedRemotely { get; set; }
    public string? ResolutionSourceValue { get; set; }

    public string? RelatedKnowledgeArticleId { get; set; }
    public KnowledgeArticle? RelatedKnowledgeArticle { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ClosedAt { get; set; }

    public ICollection<TicketStatusHistory> StatusHistory { get; set; } = new List<TicketStatusHistory>();
    public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
    public ICollection<TicketClassificationLog> ClassificationLogs { get; set; } = new List<TicketClassificationLog>();
    public ICollection<RetrievalLog> RetrievalLogs { get; set; } = new List<RetrievalLog>();
    public ChatSession? ChatSession { get; set; }
}
