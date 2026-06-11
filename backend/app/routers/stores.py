from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Store
from app.schemas.prediction import WaitTimePredictionResponse
from app.schemas.store import StoreResponse
from app.services.ml_prediction_service import (
    get_store_wait_time_prediction,
    get_store_wait_time_summary,
)


router = APIRouter(
    prefix="/api/stores",
    tags=["Stores"],
)


def apply_wait_time_summary(db: Session, store: Store) -> Store:
    summary = get_store_wait_time_summary(
        db=db,
        store_id=store.id,
    )

    store.current_waiting_count = summary["current_waiting_count"]
    store.estimated_wait_time = summary["estimated_wait_time"]

    return store


@router.get("", response_model=List[StoreResponse])
def get_stores(db: Session = Depends(get_db)):
    stores = (
        db.query(Store)
        .filter(Store.is_active.is_(True))
        .order_by(Store.id.asc())
        .all()
    )

    for store in stores:
        apply_wait_time_summary(db, store)

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

    apply_wait_time_summary(db, store)

    return store