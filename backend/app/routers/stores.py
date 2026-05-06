from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Store
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

    return store