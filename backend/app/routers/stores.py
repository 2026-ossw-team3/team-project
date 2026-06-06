from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import QueueEntry, Store
from app.schemas.prediction import WaitTimePredictionResponse
from app.schemas.store import StoreResponse
from app.services.ml_prediction_service import get_store_wait_time_prediction
from app.utils.datetime import today_kst


router = APIRouter(
    prefix="/api/stores",
    tags=["Stores"],
)


@router.get("", response_model=List[StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    stores = (
        db.query(Store)
        .filter(Store.is_active.is_(True))
        .order_by(Store.id.asc())
        .all()
    )

    today = today_kst()

    for store in stores:
        waiting_count = (
            db.query(func.count(QueueEntry.id))
            .filter(
                QueueEntry.store_id == store.id,
                QueueEntry.queue_date == today,
                QueueEntry.status == "WAITING",
            )
            .scalar()
        )
        store.current_waiting_count = waiting_count

    return stores


@router.get("/{store_id}/prediction", response_model=WaitTimePredictionResponse)
def get_store_prediction(
    store_id: int,
    include_candidates: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    return get_store_wait_time_prediction(
        db=db,
        store_id=store_id,
        include_candidates=include_candidates,
    )


@router.get("/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found",
        )

    waiting_count = (
        db.query(func.count(QueueEntry.id))
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today_kst(),
            QueueEntry.status == "WAITING",
        )
        .scalar()
    )
    store.current_waiting_count = waiting_count

    return store