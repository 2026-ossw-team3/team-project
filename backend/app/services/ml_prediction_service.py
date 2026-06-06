from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.constants import QueueStatus
from app.ml.prediction_service import predict_total_wait_minutes
from app.models import QueueEntry, Store
from app.utils.datetime import today_kst


def get_store_or_404(db: Session, store_id: int) -> Store:
    store = db.query(Store).filter(Store.id == store_id).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="STORE_NOT_FOUND",
        )

    return store


def count_current_waiting_queues(db: Session, store_id: int) -> int:
    return (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today_kst(),
            QueueEntry.status == QueueStatus.WAITING.value,
        )
        .count()
    )


def get_store_wait_time_summary(
    db: Session,
    store_id: int,
) -> dict:
    queue_ahead_team_count = count_current_waiting_queues(
        db=db,
        store_id=store_id,
    )

    prediction_result = predict_total_wait_minutes(
        store_id=store_id,
        queue_ahead_team_count=queue_ahead_team_count,
        include_candidates=False,
    )

    return {
        "current_waiting_count": queue_ahead_team_count,
        "estimated_wait_time": prediction_result["estimated_total_wait_minutes"],
    }


def get_store_wait_time_prediction(
    db: Session,
    store_id: int,
    include_candidates: bool = False,
) -> dict:
    store = get_store_or_404(db, store_id)

    if not store.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="STORE_INACTIVE",
        )

    queue_ahead_team_count = count_current_waiting_queues(
        db=db,
        store_id=store_id,
    )

    return predict_total_wait_minutes(
        store_id=store_id,
        queue_ahead_team_count=queue_ahead_team_count,
        include_candidates=include_candidates,
    )