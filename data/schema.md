# Dataset Schema

Two files: `knowledge_base.json` (approved articles) and `incidents.json` (tickets, mapped many-to-one to a KB article for retrieval evaluation). This mirrors the analysis document's KB-0015 example (SmartHelp_AI_DU_AI_Project_Analysis.docx, section 8.3) and the sprint proposal's data plan (section F).

## knowledge_base.json — array of

| Field | Type | Notes |
|---|---|---|
| `kb_id` | string | `KB-0001`, `KB-0002`, ... |
| `category` | string | one of: `Software`, `Hardware`, `Network`, `Account` |
| `problem_ar` | string | short problem title, Arabic |
| `problem_en` | string | short problem title, English |
| `error` | string \| null | literal error string, kept in original form (often English even in Arabic tickets, e.g. `VCRUNTIME140.dll missing`) |
| `root_cause_ar` | string | |
| `root_cause_en` | string | |
| `solution_ar` | string | numbered steps as a single string |
| `solution_en` | string | |
| `related_package` | string \| null | e.g. `PKG-0041`, references a fictional approved package |
| `approval_status` | string | `Approved` (all seed articles are approved) |
| `escalation_note_ar` | string | when to escalate if this solution doesn't work |
| `escalation_note_en` | string | |

## incidents.json — array of

| Field | Type | Notes |
|---|---|---|
| `id` | string | `INC-0001`, ... |
| `text` | string | the incident as a user would actually type it — mostly Arabic, technical terms/error strings left in English, natural spelling variation (including common typos) |
| `language_mix` | string | `ar`, `ar+en`, `en` — tags the dominant style for later slicing of results |
| `category` | string | ground-truth label for classification eval |
| `gold_kb_id` | string | which KB article is the correct retrieval target |
| `paraphrase_style` | string | `direct` (close to KB wording), `paraphrase` (same meaning, different words), `vague` (underspecified, tests low-confidence/escalation path), `misleading` (mentions a plausible but wrong cause) |
| `split` | string | `train` or `eval` — eval set is untouched during any threshold tuning |
| `rewritten_by_human` | boolean | true for the subset the team hand-rewrites in their own words, per the circularity mitigation agreed with the user |

## Design notes

- **Many-to-one incidents→KB** (roughly 3–4 incidents per article) so Top-K retrieval is actually tested against paraphrase robustness, not just lookup (analysis doc Phase 8 testing: "Test paraphrases with different wording").
- **4 flat categories, no subcategories** (Software / Hardware / Network / Account) — chosen so ~150 incidents gives ~37 per class, enough for a defensible confusion matrix.
- **`vague` and `misleading` incidents are deliberately included** in the eval split to test the "insufficient evidence → escalate" behavior required by the analysis doc (section 7.3), not just top-line accuracy.
- **Circularity mitigation**: after the full 150 are generated, the team hand-rewrites ~15–20 eval incidents in their own words (`rewritten_by_human: true`) and that subset's score is reported separately alongside the full eval score.
