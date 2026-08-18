using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SmartHelpAI.Api.Models;

namespace SmartHelpAI.Api.Data;

public static class DbSeeder
{
    private class KnowledgeArticleSeedRow
    {
        [JsonPropertyName("kb_id")] public string KbId { get; set; } = string.Empty;
        [JsonPropertyName("category")] public string Category { get; set; } = string.Empty;
        [JsonPropertyName("problem_ar")] public string ProblemAr { get; set; } = string.Empty;
        [JsonPropertyName("problem_en")] public string ProblemEn { get; set; } = string.Empty;
        [JsonPropertyName("error")] public string? Error { get; set; }
        [JsonPropertyName("root_cause_ar")] public string RootCauseAr { get; set; } = string.Empty;
        [JsonPropertyName("root_cause_en")] public string RootCauseEn { get; set; } = string.Empty;
        [JsonPropertyName("solution_ar")] public string SolutionAr { get; set; } = string.Empty;
        [JsonPropertyName("solution_en")] public string SolutionEn { get; set; } = string.Empty;
        [JsonPropertyName("related_package")] public string? RelatedPackage { get; set; }
        [JsonPropertyName("approval_status")] public string ApprovalStatus { get; set; } = "Draft";
        [JsonPropertyName("escalation_note_ar")] public string EscalationNoteAr { get; set; } = string.Empty;
        [JsonPropertyName("escalation_note_en")] public string EscalationNoteEn { get; set; } = string.Empty;
    }

    public static async Task SeedAsync(AppDbContext db, string dataDirectory)
    {
        if (await db.KnowledgeArticles.AnyAsync())
        {
            return;
        }

        var kbPath = Path.Combine(dataDirectory, "knowledge_base.json");
        if (!File.Exists(kbPath))
        {
            return;
        }

        var json = await File.ReadAllTextAsync(kbPath);
        var rows = JsonSerializer.Deserialize<List<KnowledgeArticleSeedRow>>(json)
            ?? new List<KnowledgeArticleSeedRow>();

        var packageIds = rows
            .Where(r => !string.IsNullOrEmpty(r.RelatedPackage))
            .Select(r => r.RelatedPackage!)
            .Distinct()
            .ToList();

        foreach (var packageId in packageIds)
        {
            db.Packages.Add(new Package
            {
                Id = packageId,
                Name = packageId,
                VersionLabel = "1.0",
                FileName = $"{packageId}.msi",
                Sha256Hash = string.Empty,
                ApprovalStatus = "Approved",
                Description = "Seed placeholder — metadata not part of the sprint dataset."
            });
        }

        foreach (var row in rows)
        {
            db.KnowledgeArticles.Add(new KnowledgeArticle
            {
                Id = row.KbId,
                Category = row.Category,
                ProblemAr = row.ProblemAr,
                ProblemEn = row.ProblemEn,
                ErrorText = row.Error,
                RootCauseAr = row.RootCauseAr,
                RootCauseEn = row.RootCauseEn,
                SolutionAr = row.SolutionAr,
                SolutionEn = row.SolutionEn,
                RelatedPackageId = row.RelatedPackage,
                ApprovalStatus = row.ApprovalStatus,
                EscalationNoteAr = row.EscalationNoteAr,
                EscalationNoteEn = row.EscalationNoteEn
            });
        }

        await db.SaveChangesAsync();
    }
}
