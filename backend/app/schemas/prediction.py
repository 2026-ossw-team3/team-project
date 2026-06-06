from __future__ import annotations

from pydantic import BaseModel


class CandidatePredictionResponse(BaseModel):
    estimated_total_wait_minutes: int | None = None
    mae: float | None = None
    model_type: str
    is_available: bool
    error: str | None = None


class WaitTimePredictionResponse(BaseModel):
    store_id: int
    queue_ahead_team_count: int
    selected_model: str | None = None
    estimated_total_wait_minutes: int
    model_type: str
    is_fallback: bool
    candidate_predictions: dict[str, CandidatePredictionResponse] | None = None