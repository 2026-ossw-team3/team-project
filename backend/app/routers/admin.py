# Week3 구현 예정
# GET /api/admin/stores/{store_id}/queues
# POST /api/admin/stores/{store_id}/call-next
# POST /api/admin/queues/{queue_id}/call
# POST /api/admin/queues/{queue_id}/serve
# POST /api/admin/queues/{queue_id}/no-show
# GET /api/admin/stores/{store_id}/dashboard

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Store
from app.schemas.admin import AdminQueueListResponse
from app.services.admin_service import get_admin_queue_list


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


@router.get("/stores/{store_id}/queues", response_model=AdminQueueListResponse)
def get_admin_store_queues(store_id: int, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()

    if not store:
        raise HTTPException(
            status_code=404,
            detail="Store not found",
        )

    queues = get_admin_queue_list(db, store_id)

    return {
        "store_id": store_id,
        "queues": queues,
    }


# KAN-20 구현 예정
# POST /api/admin/stores/{store_id}/call-next
# POST /api/admin/queues/{queue_id}/call
#
# KAN-21 구현 예정
# POST /api/admin/queues/{queue_id}/serve
# POST /api/admin/queues/{queue_id}/no-show
#
# KAN-22 구현 예정
# GET /api/admin/stores/{store_id}/dashboard
