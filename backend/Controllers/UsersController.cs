using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Data;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Controllers;

public record CreateUserRequest(string FullName, string Email, string Password, int RoleId, string? Department);

// User management (list/create accounts of any role) is an Admin-only
// capability — self-service registration lives at POST /api/auth/register
// and always creates a plain "User" account.
[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAll([FromQuery] int? roleId)
    {
        var query = _db.Users.Include(u => u.Role).AsQueryable();
        if (roleId is not null)
        {
            query = query.Where(u => u.RoleId == roleId);
        }

        return await query.OrderBy(u => u.FullName).ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetById(int id)
    {
        var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
        return user is null ? NotFound() : user;
    }

    [HttpPost]
    public async Task<ActionResult<User>> Create(CreateUserRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Conflict("A user with this email already exists.");
        }

        if (!await _db.Roles.AnyAsync(r => r.Id == request.RoleId))
        {
            return BadRequest("RoleId does not exist.");
        }

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            RoleId = request.RoleId,
            Department = request.Department
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }
}
