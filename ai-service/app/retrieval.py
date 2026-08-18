import json
from functools import lru_cache

import faiss
import numpy as np

from app.config import KNOWLEDGE_BASE_PATH
from app.embeddings import get_embedding_model


def _article_text(article: dict) -> str:
    parts = [article["problem_en"], article["problem_ar"]]
    if article.get("error"):
        parts.append(article["error"])
    return " | ".join(parts)


class KnowledgeBaseIndex:
    def __init__(self, articles: list[dict]):
        self.articles = articles
        model = get_embedding_model()
        embeddings = model.encode(
            [_article_text(a) for a in articles],
            normalize_embeddings=True,
        )
        embeddings = np.asarray(embeddings, dtype="float32")
        self.index = faiss.IndexFlatIP(embeddings.shape[1])
        self.index.add(embeddings)

    def search(self, query: str, top_k: int) -> list[dict]:
        model = get_embedding_model()
        query_vec = model.encode([query], normalize_embeddings=True)
        query_vec = np.asarray(query_vec, dtype="float32")

        scores, indices = self.index.search(query_vec, min(top_k, len(self.articles)))

        results = []
        for rank, (score, idx) in enumerate(zip(scores[0], indices[0]), start=1):
            if idx < 0:
                continue
            article = self.articles[idx]
            results.append(
                {
                    "rank": rank,
                    "similarity_score": float(score),
                    "kb_id": article["kb_id"],
                    "category": article["category"],
                    "problem_en": article["problem_en"],
                    "problem_ar": article["problem_ar"],
                    "solution_en": article["solution_en"],
                    "solution_ar": article["solution_ar"],
                    "escalation_note_en": article["escalation_note_en"],
                    "escalation_note_ar": article["escalation_note_ar"],
                    "related_package": article.get("related_package"),
                }
            )
        return results


@lru_cache(maxsize=1)
def get_knowledge_base_index() -> KnowledgeBaseIndex:
    with open(KNOWLEDGE_BASE_PATH, encoding="utf-8") as f:
        articles = json.load(f)
    return KnowledgeBaseIndex(articles)
