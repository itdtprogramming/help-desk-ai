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

public record ReassignTicketRequest(int TechnicianUserId);

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

    // A ticket is visible to: the reporter, an Admin (sees everything), or
    // the Technician it is currently assigned to. A Technician a ticket has
    // not been routed to cannot see it at all — assignment is what grants
    // access, not the role by itself.
    private bool CanAccessTicket(Ticket ticket) =>
        User.IsInRole("Admin") ||
        ticket.ReportedByUserId == CurrentUserId ||
        (User.IsInRole("Technician") && ticket.AssignedTechnicianId == CurrentUserId);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ticket>>> GetAll(
        [FromQuery] string? status,
        [FromQuery] string? category,
        [FromQuery] int? assignedTechnicianId)
    {
        var query = _db.Tickets.AsQueryable();

        // Admin sees every ticket. A User only ever sees what they reported.
        // A Technician only sees tickets an Admin has routed to them —
        // there is no shared "queue" of unassigned work to browse.
        if (User.IsInRole("Technician"))
        {
            query = query.Where(t => t.AssignedTechnicianId == CurrentUserId);
        }
        else if (!User.IsInRole("Admin"))
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

        if (!CanAccessTicket(ticket))
        {
            return Forbid();
        }

        // Internal notes are staff-only; a reporter viewing their own ticket
        // never sees them, regardless of who wrote them.
        bool isStaffForThisTicket = User.IsInRole("Admin") || ticket.AssignedTechnicianId == CurrentUserId;
        if (!isStaffForThisTicket)
        {
            ticket.Comments = ticket.Comments.Where(c => !c.IsInternal).ToList();
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

    // Resolution work (status changes, self-assignment) is Technician-only —
    // separation of duties: Admin governs users/roles/oversight and can
    // reassign a ticket to a technician, but does not personally resolve
    // tickets. This keeps "who is allowed to fix things" and "who fixed
    // this ticket" on distinct, auditable roles.
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Technician")]
    public async Task<ActionResult<Ticket>> UpdateStatus(int id, UpdateTicketStatusRequest request)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        if (ticket.AssignedTechnicianId != CurrentUserId)
        {
            return Forbid();
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

    // Admin-only routing action: a Technician never sees a ticket until an
    // Admin routes it to them, so assignment is exclusively an Admin action
    // (there is no technician-initiated self-assign). Does not change status
    // — reassignment is a management action, not a signal that work started.
    [HttpPatch("{id:int}/reassign")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Ticket>> Reassign(int id, ReassignTicketRequest request)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        var technician = await _db.Users.Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == request.TechnicianUserId);
        if (technician is null || technician.Role?.Name != "Technician")
        {
            return BadRequest("TechnicianUserId must belong to a Technician account.");
        }

        ticket.AssignedTechnicianId = technician.Id;
        ticket.UpdatedAt = DateTime.UtcNow;

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

        if (!CanAccessTicket(ticket))
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

    // Completes Admin's CRUD authority over tickets (create is open to any
    // authenticated reporter, read/update are covered above) — deleting a
    // ticket record is an administrative action, not part of resolution.
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var ticket = await _db.Tickets.FirstOrDefaultAsync(t => t.Id == id);
        if (ticket is null)
        {
            return NotFound();
        }

        _db.Tickets.Remove(ticket);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
