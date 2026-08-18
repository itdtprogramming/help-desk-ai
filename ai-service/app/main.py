from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.classifier import get_ticket_classifier
from app.config import (
    CLASSIFICATION_CONFIDENCE_THRESHOLD,
    RETRIEVAL_CONFIDENCE_THRESHOLD,
    TOP_K_DEFAULT,
)
from app.retrieval import get_knowledge_base_index


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the embedding model, FAISS index, and classifier once at startup
    # rather than on the first request, so first-request latency is not
    # dominated by model loading + training.
    get_knowledge_base_index()
    get_ticket_classifier()
    yield


app = FastAPI(title="SmartHelp AI Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClassifyRequest(BaseModel):
    text: str


class ClassifyResponse(BaseModel):
    predicted_category: str
    confidence: float
    needs_review: bool


class RetrieveRequest(BaseModel):
    query: str
    top_k: int = TOP_K_DEFAULT


class RetrieveResponse(BaseModel):
    results: list[dict]
    needs_escalation: bool


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/classify", response_model=ClassifyResponse)
def classify(request: ClassifyRequest) -> ClassifyResponse:
    classifier = get_ticket_classifier()
    category, confidence = classifier.predict(request.text)
    return ClassifyResponse(
        predicted_category=category,
        confidence=confidence,
        needs_review=confidence < CLASSIFICATION_CONFIDENCE_THRESHOLD,
    )


@app.post("/retrieve", response_model=RetrieveResponse)
def retrieve(request: RetrieveRequest) -> RetrieveResponse:
    index = get_knowledge_base_index()
    results = index.search(request.query, request.top_k)
    top_score = results[0]["similarity_score"] if results else 0.0
    return RetrieveResponse(
        results=results,
        needs_escalation=top_score < RETRIEVAL_CONFIDENCE_THRESHOLD,
    )
