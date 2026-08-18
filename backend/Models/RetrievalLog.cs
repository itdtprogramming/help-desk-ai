namespace SmartHelpAI.Api.Models;

public class RetrievalLog
{
    public int Id { get; set; }

    public int? TicketId { get; set; }
    public Ticket? Ticket { get; set; }

    public string QueryText { get; set; } = string.Empty;
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RetrievalResult> Results { get; set; } = new List<RetrievalResult>();
}

public class RetrievalResult
{
    public int Id { get; set; }

    public int RetrievalLogId { get; set; }
    public RetrievalLog? RetrievalLog { get; set; }

    public string KnowledgeArticleId { get; set; } = string.Empty;
    public KnowledgeArticle? KnowledgeArticle { get; set; }

    public int Rank { get; set; }
    public double SimilarityScore { get; set; }
}
