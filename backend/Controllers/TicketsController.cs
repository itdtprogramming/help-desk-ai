using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Data;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Controllers;

public record CreateTicketRequest(
    string ProblemDescription,
    string? ErrorMessage,
    string Category,
    string Priority = "Medium");

public record UpdateTicketStatusRequest(string NewStatus, string? Note);

public record AddTicketCommentRequest(string Body, bool IsInternal = false);

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TicketsController(AppDbContext db)
    {
        _db = db;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private bool IsTechnicianOrAdmin => User.IsInRole("Technician") || User.IsInRole("Admin");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] int? assignedTechnicianId)
    {
        var query = _db.Tickets.AsQueryable();

        // Plain "User" accounts only ever see the tickets they reported;
        // the technician queue (all tickets) is restricted to staff roles.
        if (!IsTechnicianOrAdmin)
        {
            query = query.Where(t => t.ReportedByUserId == CurrentUserId);
        }

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

        if (ticket is null)
        {
            return NotFound();
        }

        if (!IsTechnicianOrAdmin && ticket.ReportedByUserId != CurrentUserId)
        {
            return Forbid();
        }

        return ticket;
    }

    [HttpPost]
    public async Task<ActionResult<Ticket>> Create(CreateTicketRequest request)
    {
        var ticket = new Ticket
        {
            ReportedByUserId = CurrentUserId,
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
    [Authorize(Roles = "Technician,Admin")]
    public async Task<ActionResult<Ticket>> UpdateStatus(int id, UpdateTicketStatusRequest request)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        _db.TicketStatusHistories.Add(new TicketStatusHistory
        {
            TicketId = ticket.Id,
            OldStatus = ticket.Status,
            NewStatus = request.NewStatus,
            ChangedByUserId = CurrentUserId,
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

    [HttpPatch("{id:int}/assign")]
    [Authorize(Roles = "Technician,Admin")]
    public async Task<ActionResult<Ticket>> AssignToSelf(int id)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        ticket.AssignedTechnicianId = CurrentUserId;
        ticket.UpdatedAt = DateTime.UtcNow;
        if (ticket.Status == TicketStatus.New)
        {
            ticket.Status = TicketStatus.InProgress;
        }

        await _db.SaveChangesAsync();
        return ticket;
    }

    [HttpPost("{id:int}/comments")]
    public async Task<ActionResult<TicketComment>> AddComment(int id, AddTicketCommentRequest request)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        if (!IsTechnicianOrAdmin && ticket.ReportedByUserId != CurrentUserId)
        {
            return Forbid();
        }

        var comment = new TicketComment
        {
            TicketId = id,
            AuthorUserId = CurrentUserId,
            Body = request.Body,
            // Only staff can mark a comment internal-only; a reporter's own
            // comment is never hidden from them.
            IsInternal = request.IsInternal && IsTechnicianOrAdmin,
        };

        _db.TicketComments.Add(comment);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id }, comment);
    }
}
