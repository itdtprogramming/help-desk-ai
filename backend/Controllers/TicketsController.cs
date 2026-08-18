using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Data;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Controllers;

public record CreateTicketRequest(
    int ReportedByUserId,
    string ProblemDescription,
    string? ErrorMessage,
    string Category,
    string Priority = "Medium");

public record UpdateTicketStatusRequest(string NewStatus, int ChangedByUserId, string? Note);

public record AddTicketCommentRequest(int AuthorUserId, string Body, bool IsInternal = false);

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TicketsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] int? assignedTechnicianId)
    {
        var query = _db.Tickets.AsQueryable();

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(t => t.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(t => t.Category == category);
        }

        if (assignedTechnicianId is not null)
        {
            query = query.Where(t => t.AssignedTechnicianId == assignedTechnicianId);
        }

        return await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Ticket>> GetById(int id)
    {
        var ticket = await _db.Tickets
            .Include(t => t.StatusHistory)
            .Include(t => t.Comments)
            .Include(t => t.RelatedKnowledgeArticle)
            .FirstOrDefaultAsync(t => t.Id == id);

        return ticket is null ? NotFound() : ticket;
    }

    [HttpPost]
    public async Task<ActionResult<Ticket>> Create(CreateTicketRequest request)
    {
        if (!await _db.Users.AnyAsync(u => u.Id == request.ReportedByUserId))
        {
            return BadRequest("ReportedByUserId does not exist.");
        }

        var ticket = new Ticket
        {
            ReportedByUserId = request.ReportedByUserId,
            ProblemDescription = request.ProblemDescription,
            ErrorMessage = request.ErrorMessage,
            Category = request.Category,
            Priority = request.Priority,
            Status = TicketStatus.New
        };

        _db.Tickets.Add(ticket);
        await _db.SaveChangesAsync();

        ticket.DisplayCode = $"TCK-{ticket.Id:D5}";
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<ActionResult<Ticket>> UpdateStatus(int id, UpdateTicketStatusRequest request)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        if (!await _db.Users.AnyAsync(u => u.Id == request.ChangedByUserId))
        {
            return BadRequest("ChangedByUserId does not exist.");
        }

        _db.TicketStatusHistories.Add(new TicketStatusHistory
        {
            TicketId = ticket.Id,
            OldStatus = ticket.Status,
            NewStatus = request.NewStatus,
            ChangedByUserId = request.ChangedByUserId,
            Note = request.Note
        });

        ticket.Status = request.NewStatus;
        ticket.UpdatedAt = DateTime.UtcNow;
        if (request.NewStatus is TicketStatus.Resolved or TicketStatus.Closed)
        {
            ticket.ClosedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return ticket;
    }

    [HttpPost("{id:int}/comments")]
    public async Task<ActionResult<TicketComment>> AddComment(int id, AddTicketCommentRequest request)
    {
        if (!await _db.Tickets.AnyAsync(t => t.Id == id))
        {
            return NotFound();
        }

        if (!await _db.Users.AnyAsync(u => u.Id == request.AuthorUserId))
        {
            return BadRequest("AuthorUserId does not exist.");
        }

        var comment = new TicketComment
        {
            TicketId = id,
            AuthorUserId = request.AuthorUserId,
            Body = request.Body,
            IsInternal = request.IsInternal
        };

        _db.TicketComments.Add(comment);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id }, comment);
    }
}
