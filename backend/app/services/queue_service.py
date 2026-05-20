import uuid
from datetime import date

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent, Store
from app.schemas.queue import QueueCreateRequest


ACTIVE_QUEUE_STATUSES = ["WAITING", "CALLED", "ARRIVED"]


def create_queue_entry(db: Session, request: QueueCreateRequest):
    last_entry = (
        db.query(QueueEntry)
        .filter(QueueEntry.store_id == request.store_id)
        .order_by(QueueEntry.id.desc())
        .first()
    )
    next_number = (last_entry.queue_number + 1) if last_entry else 1

    access_code = str(uuid.uuid4())[:8].upper()

    new_entry = QueueEntry(
        store_id=request.store_id,
        nickname=request.nickname,
        party_size=request.party_size,
        queue_number=next_number,
        access_code=access_code,
        status="WAITING",
        queue_date=date.today(),
    )

    try:
        db.add(new_entry)
        db.flush()

        new_event = QueueEvent(
            queue_entry_id=new_entry.id,
            store_id=request.store_id,
            event_type="REGISTERED",
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

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="번호표 발급 중 오류가 발생했습니다.",
        )


def get_queue_detail(db: Session, queue_id: int, access_token: str):
    entry = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QUEUE_NOT_FOUND",
        )

    if entry.access_code != access_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="INVALID_ACCESS_CODE",
        )

    today = date.today()
    ahead_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == entry.store_id,
            QueueEntry.queue_date == today,
            QueueEntry.queue_number < entry.queue_number,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .count()
    )

    store = db.query(Store).filter(Store.id == entry.store_id).first()
    average_service_time = store.average_service_time if store else 3

    if entry.status == "WAITING":
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


def cancel_queue(db: Session, queue_id: int, access_token: str):
    entry = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QUEUE_NOT_FOUND",
        )

    if entry.access_code != access_token:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="INVALID_ACCESS_CODE",
        )

    if entry.status in ["SERVED", "CANCELED", "NO_SHOW"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"이미 {entry.status} 상태이므로 취소할 수 없습니다.",
        )

    try:
        entry.status = "CANCELED"
        entry.canceled_at = func.now()
        db.flush()

        cancel_event = QueueEvent(
            queue_entry_id=entry.id,
            store_id=entry.store_id,
            event_type="CANCELED",
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
            detail="대기 취소 처리 중 서버 오류가 발생했습니다.",
        )