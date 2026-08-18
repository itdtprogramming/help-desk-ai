"""Pick RETRIEVAL_CONFIDENCE_THRESHOLD using the train split only.

The eval split must stay untouched during tuning (data/schema.md design
notes), so this scans candidate thresholds against `train` and reports the
one with the best F1 for predicting "top-3 retrieval will fail" from the
top-1 similarity score. Run from ai-service/:
    .venv/Scripts/python scripts/tune_threshold.py
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import INCIDENTS_PATH
from app.retrieval import get_knowledge_base_index


def main() -> None:
    with open(INCIDENTS_PATH, encoding="utf-8") as f:
        incidents = json.load(f)
    train_rows = [row for row in incidents if row["split"] == "train"]

    index = get_knowledge_base_index()

    scored = []
    for row in train_rows:
        results = index.search(row["text"], top_k=3)
        retrieved_ids = [r["kb_id"] for r in results]
        top_score = results[0]["similarity_score"] if results else 0.0
        should_have_escalated = row["gold_kb_id"] not in retrieved_ids
        scored.append((top_score, should_have_escalated))

    print(f"{'threshold':<12}{'precision':<12}{'recall':<10}{'f1':<8}{'escalate_rate':<15}")
    best = None
    for threshold in [i / 100 for i in range(20, 65, 5)]:
        predicted_escalate = [score < threshold for score, _ in scored]
        actual_escalate = [should for _, should in scored]

        tp = sum(1 for p, a in zip(predicted_escalate, actual_escalate) if p and a)
        fp = sum(1 for p, a in zip(predicted_escalate, actual_escalate) if p and not a)
        fn = sum(1 for p, a in zip(predicted_escalate, actual_escalate) if not p and a)

        precision = tp / (tp + fp) if (tp + fp) else 0.0
        recall = tp / (tp + fn) if (tp + fn) else 0.0
        f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
        escalate_rate = sum(predicted_escalate) / len(predicted_escalate)

        print(f"{threshold:<12}{precision:<12.2f}{recall:<10.2f}{f1:<8.2f}{escalate_rate:<15.1%}")
        if best is None or f1 > best[1]:
            best = (threshold, f1)

    print(f"\nBest threshold on train split: {best[0]} (F1={best[1]:.2f})")


if __name__ == "__main__":
    main()
