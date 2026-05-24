import uuid

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent, Store
from app.schemas.queue import QueueCreateRequest
from app.utils.datetime import now_kst, today_kst


ACTIVE_QUEUE_STATUSES = ["WAITING", "CALLED", "ARRIVED"]
CANCELABLE_QUEUE_STATUSES = ["WAITING", "CALLED"]


def get_queue_or_404(db: Session, queue_id: int) -> QueueEntry:
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QUEUE_NOT_FOUND",
        )

    return queue


def validate_access_code(queue: QueueEntry, code: str) -> None:
    if queue.access_code != code:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="INVALID_ACCESS_CODE",
        )


def create_queue_event(
    db: Session,
    queue: QueueEntry,
    event_type: str,
    to_status: str,
    from_status: str | None = None,
) -> None:
    event = QueueEvent(
        queue_entry_id=queue.id,
        store_id=queue.store_id,
        event_type=event_type,
        from_status=from_status,
        to_status=to_status,
    )
    db.add(event)


def calculate_ahead_count(db: Session, queue: QueueEntry) -> int:
    return (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == queue.store_id,
            QueueEntry.queue_date == queue.queue_date,
            QueueEntry.queue_number < queue.queue_number,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .count()
    )


def calculate_estimated_wait_time(
    queue: QueueEntry,
    ahead_count: int,
    average_service_time: int,
) -> int:
    if queue.status not in ACTIVE_QUEUE_STATUSES:
        return 0

    return ahead_count * average_service_time


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

    queue_date = today_kst()

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

        create_queue_event(
            db=db,
            queue=new_entry,
            event_type="REGISTERED",
            from_status=None,
            to_status="WAITING",
        )

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
    queue = get_queue_or_404(db, queue_id)
    validate_access_code(queue, code)

    ahead_count = calculate_ahead_count(db, queue)

    store = db.query(Store).filter(Store.id == queue.store_id).first()
    average_service_time = store.average_service_time if store else 3

    estimated_wait_time = calculate_estimated_wait_time(
        queue=queue,
        ahead_count=ahead_count,
        average_service_time=average_service_time,
    )

    return {
        "queue_id": queue.id,
        "store_id": queue.store_id,
        "store_name": store.name if store else "학식당",
        "queue_date": queue.queue_date,
        "queue_number": queue.queue_number,
        "nickname": queue.nickname,
        "party_size": queue.party_size,
        "status": queue.status,
        "ahead_count": ahead_count,
        "estimated_wait_time": estimated_wait_time,
        "created_at": queue.created_at,
        "called_at": queue.called_at,
        "arrived_at": queue.arrived_at,
        "served_at": queue.served_at,
        "canceled_at": queue.canceled_at,
        "no_show_at": queue.no_show_at,
    }


def confirm_arrival(db: Session, queue_id: int, code: str):
    queue = get_queue_or_404(db, queue_id)
    validate_access_code(queue, code)

    if queue.status != "CALLED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 상태에서는 도착 확인을 할 수 없습니다.",
        )

    try:
        queue.status = "ARRIVED"
        queue.arrived_at = now_kst()
        db.flush()

        create_queue_event(
            db=db,
            queue=queue,
            event_type="ARRIVED",
            from_status="CALLED",
            to_status="ARRIVED",
        )

        db.commit()
        db.refresh(queue)

        return {
            "message": "도착 확인이 완료되었습니다.",
            "queue_id": queue.id,
            "status": queue.status,
            "arrived_at": queue.arrived_at,
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="QUEUE_ARRIVAL_CONFIRM_FAILED",
        )


def cancel_queue(db: Session, queue_id: int, code: str):
    queue = get_queue_or_404(db, queue_id)
    validate_access_code(queue, code)

    if queue.status not in CANCELABLE_QUEUE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="현재 상태에서는 취소할 수 없습니다.",
        )

    from_status = queue.status

    try:
        queue.status = "CANCELED"
        queue.canceled_at = now_kst()
        db.flush()

        create_queue_event(
            db=db,
            queue=queue,
            event_type="CANCELED",
            from_status=from_status,
            to_status="CANCELED",
        )

        db.commit()
        db.refresh(queue)

        return {
            "message": "대기가 정상적으로 취소되었습니다.",
            "queue_id": queue.id,
            "status": queue.status,
            "canceled_at": queue.canceled_at,
        }

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="QUEUE_CANCEL_FAILED",
        )