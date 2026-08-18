from pathlib import Path

AI_SERVICE_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = AI_SERVICE_ROOT.parent / "data"

KNOWLEDGE_BASE_PATH = DATA_DIR / "knowledge_base.json"
INCIDENTS_PATH = DATA_DIR / "incidents.json"

# Multilingual so it embeds the mixed Arabic/English ticket text and KB
# articles into the same space (analysis doc section 8: bilingual dataset).
EMBEDDING_MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

TOP_K_DEFAULT = 3

# Below this similarity, retrieval treats the KB as not having a confident
# match — surfaces the "insufficient evidence -> escalate" path (analysis
# doc section 7.3) instead of returning a low-quality top-1 result. Value
# chosen by scanning thresholds against the *train* split only (best F1 for
# predicting a Top-3 miss from the top-1 score — see scripts/tune_threshold.py);
# eval split is never used to pick this so the eval numbers stay honest.
RETRIEVAL_CONFIDENCE_THRESHOLD = 0.55

CLASSIFICATION_CONFIDENCE_THRESHOLD = 0.45
