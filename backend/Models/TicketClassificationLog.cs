namespace SmartHelpAI.Api.Models;

public class TicketClassificationLog
{
    public int Id { get; set; }

    public int TicketId { get; set; }
    public Ticket? Ticket { get; set; }

    public string PredictedCategory { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime PredictedAt { get; set; } = DateTime.UtcNow;

    public bool WasOverridden { get; set; }
    public string? OverriddenCategory { get; set; }
    public int? OverriddenByUserId { get; set; }
    public User? OverriddenByUser { get; set; }
}
