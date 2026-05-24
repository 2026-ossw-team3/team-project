from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.queue import (
    QueueArrivalConfirmResponse,
    QueueCancelResponse,
    QueueCreateRequest,
    QueueCreateResponse,
    QueueDetailResponse,
)
from app.services.queue_service import (
    cancel_queue,
    confirm_arrival,
    create_queue_entry,
    get_queue_detail,
)


router = APIRouter(
    prefix="/api/queues",
    tags=["Queues"],
)


@router.post("", response_model=QueueCreateResponse)
def issue_ticket(request: QueueCreateRequest, db: Session = Depends(get_db)):
    return create_queue_entry(db, request)


@router.get("/{queue_id}", response_model=QueueDetailResponse)
def get_queue_status(
    queue_id: int,
    code: str,
    db: Session = Depends(get_db),
):
    return get_queue_detail(db, queue_id, code)


@router.delete("/{queue_id}", response_model=QueueCancelResponse)
def cancel_queue_entry(
    queue_id: int,
    code: str,
    db: Session = Depends(get_db),
):
    return cancel_queue(db, queue_id, code)


@router.post("/{queue_id}/confirm-arrival", response_model=QueueArrivalConfirmResponse)
def confirm_queue_arrival(
    queue_id: int,
    code: str,
    db: Session = Depends(get_db),
):
    return confirm_arrival(db, queue_id, code)
