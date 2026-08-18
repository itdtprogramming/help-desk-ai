"""Evaluate retrieval and classification against the held-out eval split.

Run from ai-service/: .venv/Scripts/python scripts/evaluate.py
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.classifier import get_ticket_classifier
from app.config import RETRIEVAL_CONFIDENCE_THRESHOLD, INCIDENTS_PATH
from app.retrieval import get_knowledge_base_index


def main() -> None:
    with open(INCIDENTS_PATH, encoding="utf-8") as f:
        incidents = json.load(f)
    eval_rows = [row for row in incidents if row["split"] == "eval"]

    index = get_knowledge_base_index()
    classifier = get_ticket_classifier()

    by_style = defaultdict(lambda: {"n": 0, "top1": 0, "top3": 0, "category": 0, "escalated": 0})
    misses = []
    misclassified = []

    for row in eval_rows:
        style = row["paraphrase_style"]
        bucket = by_style[style]
        bucket["n"] += 1

        results = index.search(row["text"], top_k=3)
        retrieved_ids = [r["kb_id"] for r in results]
        top_score = results[0]["similarity_score"] if results else 0.0

        if top_score < RETRIEVAL_CONFIDENCE_THRESHOLD:
            bucket["escalated"] += 1

        if retrieved_ids and retrieved_ids[0] == row["gold_kb_id"]:
            bucket["top1"] += 1
        if row["gold_kb_id"] in retrieved_ids:
            bucket["top3"] += 1
        else:
            misses.append((row["id"], row["gold_kb_id"], retrieved_ids, style, round(top_score, 2)))

        predicted_category, confidence = classifier.predict(row["text"])
        if predicted_category == row["category"]:
            bucket["category"] += 1
        else:
            misclassified.append((row["id"], row["category"], predicted_category, round(confidence, 2), style))

    n = len(eval_rows)
    top1_hits = sum(b["top1"] for b in by_style.values())
    top3_hits = sum(b["top3"] for b in by_style.values())
    correct_categories = sum(b["category"] for b in by_style.values())

    print(f"Eval set size: {n}")
    print(f"Overall Top-1 retrieval accuracy: {top1_hits}/{n} = {top1_hits / n:.1%}")
    print(f"Overall Top-3 retrieval accuracy: {top3_hits}/{n} = {top3_hits / n:.1%}")
    print(f"Overall classification accuracy:  {correct_categories}/{n} = {correct_categories / n:.1%}")

    print("\n--- Breakdown by paraphrase_style ---")
    print(f"{'style':<12}{'n':<5}{'top1':<8}{'top3':<8}{'category':<10}{'escalated':<10}")
    for style, b in sorted(by_style.items()):
        print(
            f"{style:<12}{b['n']:<5}"
            f"{b['top1'] / b['n']:<8.0%}{b['top3'] / b['n']:<8.0%}"
            f"{b['category'] / b['n']:<10.0%}{b['escalated'] / b['n']:<10.0%}"
        )

    print("\n--- Top-3 misses (id, gold, retrieved, style, top_score) ---")
    for miss in misses:
        print(miss)

    print("\n--- Misclassified (id, actual, predicted, confidence, style) ---")
    for m in misclassified:
        print(m)


if __name__ == "__main__":
    main()
