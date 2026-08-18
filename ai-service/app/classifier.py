import json
from functools import lru_cache

import numpy as np
from sklearn.linear_model import LogisticRegression

from app.config import INCIDENTS_PATH
from app.embeddings import get_embedding_model


class TicketClassifier:
    def __init__(self, incidents: list[dict]):
        train_rows = [row for row in incidents if row["split"] == "train"]

        model = get_embedding_model()
        embeddings = model.encode([row["text"] for row in train_rows], normalize_embeddings=True)

        self.categories = sorted({row["category"] for row in train_rows})
        self.clf = LogisticRegression(max_iter=1000)
        self.clf.fit(embeddings, [row["category"] for row in train_rows])

    def predict(self, text: str) -> tuple[str, float]:
        model = get_embedding_model()
        embedding = model.encode([text], normalize_embeddings=True)
        probabilities = self.clf.predict_proba(embedding)[0]
        best_idx = int(np.argmax(probabilities))
        return self.clf.classes_[best_idx], float(probabilities[best_idx])


@lru_cache(maxsize=1)
def get_ticket_classifier() -> TicketClassifier:
    with open(INCIDENTS_PATH, encoding="utf-8") as f:
        incidents = json.load(f)
    return TicketClassifier(incidents)
