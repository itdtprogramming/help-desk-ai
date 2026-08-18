namespace SmartHelpAI.Api.Models;

public class ChatSession
{
    public int Id { get; set; }

    public int? TicketId { get; set; }
    public Ticket? Ticket { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndedAt { get; set; }
    public bool EscalatedToTicket { get; set; }

    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}

public static class ChatRole
{
    public const string User = "user";
    public const string Assistant = "assistant";
}

public class ChatMessage
{
    public int Id { get; set; }

    public int ChatSessionId { get; set; }
    public ChatSession? ChatSession { get; set; }

    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;

    // JSON array of KnowledgeArticle ids that grounded this (assistant) message, if any
    public string? RetrievedKbIdsJson { get; set; }
    public string? ModelVersion { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
