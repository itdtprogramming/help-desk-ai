using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Auth;
using SmartHelpAI.Api.Data;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Controllers;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string FullName, string Email, string Password, string? Department);

public record AuthResponse(
    string Token,
    DateTime ExpiresAt,
    int UserId,
    string FullName,
    string Email,
    string Role);

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtTokenService _tokenService;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthController(AppDbContext db, JwtTokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || user.Role is null)
        {
            return Unauthorized("Invalid email or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid email or password.");
        }

        if (!user.IsActive)
        {
            return Unauthorized("This account has been deactivated.");
        }

        var (token, expiresAt) = _tokenService.CreateToken(user, user.Role.Name);
        return new AuthResponse(token, expiresAt, user.Id, user.FullName, user.Email, user.Role.Name);
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Conflict("A user with this email already exists.");
        }

        // Self-registration always creates a plain "User" account — Technician/Admin
        // accounts can only be created by an Admin via POST /api/users.
        var userRole = await _db.Roles.FirstAsync(r => r.Name == "User");

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            RoleId = userRole.Id,
            Department = request.Department,
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var (token, expiresAt) = _tokenService.CreateToken(user, userRole.Name);
        return new AuthResponse(token, expiresAt, user.Id, user.FullName, user.Email, userRole.Name);
    }
}
