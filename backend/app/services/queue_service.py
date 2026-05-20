import uuid
from datetime import date, datetime

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent, Store
from app.schemas.queue import QueueCreateRequest


ACTIVE_QUEUE_STATUSES = ["WAITING", "CALLED", "ARRIVED"]
CANCELABLE_QUEUE_STATUSES = ["WAITING", "CALLED"]


def create_queue_entry(db: Session, request: QueueCreateRequest):
    store = db.query(Store).filter(Store.id == request.store_id).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="STORE_NOT_FOUND",
        )

    if not store.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="STORE_INACTIVE",
        )

    queue_date = date.today()

    max_queue_number = (
        db.query(func.max(QueueEntry.queue_number))
        .filter(
            QueueEntry.store_id == request.store_id,
            QueueEntry.queue_date == queue_date,
        )
        .scalar()
    )
    next_number = (max_queue_number or 0) + 1

    access_code = str(uuid.uuid4())[:6].upper()

    new_entry = QueueEntry(
        store_id=request.store_id,
        nickname=request.nickname,
        party_size=request.party_size,
        queue_date=queue_date,
        queue_number=next_number,
        access_code=access_code,
        status="WAITING",
    )

    try:
        db.add(new_entry)
        db.flush()

        new_event = QueueEvent(
            queue_entry_id=new_entry.id,
            store_id=new_entry.store_id,
            event_type="REGISTERED",
            from_status=None,
            to_status="WAITING",
        )
        db.add(new_event)

        db.commit()
        db.refresh(new_entry)

        return {
            "queue_id": new_entry.id,
            "store_id": new_entry.store_id,
            "queue_number": new_entry.queue_number,
            "access_code": new_entry.access_code,
            "status": new_entry.status,
        }

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="QUEUE_NUMBER_CONFLICT",
        )

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="QUEUE_CREATE_FAILED",
        )


def get_queue_detail(db: Session, queue_id: int, code: str):
    entry = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QUEUE_NOT_FOUND",
        )

    if entry.access_code != code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="INVALID_ACCESS_CODE",
        )

    ahead_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == entry.store_id,
            QueueEntry.queue_date == entry.queue_date,
            QueueEntry.queue_number < entry.queue_number,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .count()
    )

    store = db.query(Store).filter(Store.id == entry.store_id).first()
    average_service_time = store.average_service_time if store else 3

    if entry.status in ACTIVE_QUEUE_STATUSES:
        estimated_wait_time = ahead_count * average_service_time
    else:
        estimated_wait_time = 0

    return {
        "queue_id": entry.id,
        "store_id": entry.store_id,
        "store_name": store.name if store else "학식당",
        "queue_date": entry.queue_date,
        "queue_number": entry.queue_number,
        "nickname": entry.nickname,
        "party_size": entry.party_size,
        "status": entry.status,
        "ahead_count": ahead_count,
        "estimated_wait_time": estimated_wait_time,
        "created_at": entry.created_at,
        "called_at": entry.called_at,
        "arrived_at": entry.arrived_at,
        "served_at": entry.served_at,
        "canceled_at": entry.canceled_at,
        "no_show_at": entry.no_show_at,
    }


def cancel_queue(db: Session, queue_id: int, code: str):
    entry = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QUEUE_NOT_FOUND",
        )

    if entry.access_code != code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="INVALID_ACCESS_CODE",
        )

    if entry.status not in CANCELABLE_QUEUE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 상태에서는 취소할 수 없습니다.",
        )

    from_status = entry.status

    try:
        entry.status = "CANCELED"
        entry.canceled_at = datetime.now()
        db.flush()

        cancel_event = QueueEvent(
            queue_entry_id=entry.id,
            store_id=entry.store_id,
            event_type="CANCELED",
            from_status=from_status,
            to_status="CANCELED",
        )
        db.add(cancel_event)

        db.commit()
        db.refresh(entry)

        return {
            "message": "대기가 정상적으로 취소되었습니다.",
            "queue_id": entry.id,
            "status": entry.status,
            "canceled_at": entry.canceled_at,
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="QUEUE_CANCEL_FAILED",
        )