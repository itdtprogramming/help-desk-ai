using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Data;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnowledgeArticlesController : ControllerBase
{
    private readonly AppDbContext _db;

    public KnowledgeArticlesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<KnowledgeArticle>>> GetAll([FromQuery] string? category)
    {
        var query = _db.KnowledgeArticles.AsQueryable();
        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(a => a.Category == category);
        }

        return await query.OrderBy(a => a.Id).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<KnowledgeArticle>> GetById(string id)
    {
        var article = await _db.KnowledgeArticles
            .Include(a => a.RelatedPackage)
            .FirstOrDefaultAsync(a => a.Id == id);

        return article is null ? NotFound() : article;
    }
}
