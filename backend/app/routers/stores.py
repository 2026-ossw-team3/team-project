from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Store, QueueEntry
from app.schemas.store import StoreResponse


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

    for store in stores:
        waiting_count = (
            db.query(func.count(QueueEntry.id))
            .filter(
                QueueEntry.store_id == store.id,
                QueueEntry.status == "WAITING"
            )
            .scalar()
        )
        store.current_waiting_count = waiting_count

    return stores


@router.get("/{store_id}", response_model=StoreResponse)
def get_store(store_id: int, db: Session = Depends(get_db)):
    store = (
        db.query(Store)
        .filter(Store.id == store_id)
        .first()
    )

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found",
        )
    
    waiting_count = (
        db.query(func.count(QueueEntry.id))
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.status == "WAITING"
        )
        .scalar()
    )
    store.current_waiting_count = waiting_count

    return store