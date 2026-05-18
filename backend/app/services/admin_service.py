# Week3 구현 예정
# 운영자 대기열 관리와 상태 전환 로직을 담당한다.
#
# 예정 함수:
# - get_admin_queue_list
# - call_next_queue
# - call_queue
# - serve_queue
# - mark_no_show
# KAN-20 구현: call_next_queue, call_queue
# KAN-21 구현: serve_queue, mark_no_show

from datetime import date, datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent


ACTIVE_QUEUE_STATUSES = ("WAITING", "CALLED", "ARRIVED")


def get_admin_queue_list(db: Session, store_id: int):
    return (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .order_by(
            QueueEntry.queue_date.asc(),
            QueueEntry.queue_number.asc(),
        )
        .all()
    )


def add_queue_event(
    db: Session,
    queue: QueueEntry,
    event_type: str,
    from_status: str | None,
    to_status: str,
    memo: str,
):
    db.add(
        QueueEvent(
            queue_entry_id=queue.id,
            store_id=queue.store_id,
            event_type=event_type,
            from_status=from_status,
            to_status=to_status,
            memo=memo,
        )
    )


def call_next_queue(db: Session, store_id: int):
    queue = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == date.today(),
            QueueEntry.status == "WAITING",
        )
        .order_by(
            QueueEntry.queue_number.asc(),
        )
        .first()
    )

    if not queue:
        raise HTTPException(status_code=404, detail="Waiting queue not found")

    queue.status = "CALLED"
    queue.called_at = datetime.now()

    add_queue_event(db, queue, "CALLED", "WAITING", "CALLED", "운영자 호출")

    db.commit()
    db.refresh(queue)

    return queue


def call_queue(db: Session, queue_id: int):
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    if queue.status != "WAITING":
        raise HTTPException(
            status_code=400,
            detail="Only WAITING queue can be called",
        )

    queue.status = "CALLED"
    queue.called_at = datetime.now()

    add_queue_event(db, queue, "CALLED", "WAITING", "CALLED", "운영자 호출")

    db.commit()
    db.refresh(queue)

    return queue


def serve_queue(db: Session, queue_id: int):
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    if queue.status not in ("CALLED", "ARRIVED"):
        raise HTTPException(
            status_code=400,
            detail="Only CALLED or ARRIVED queue can be served",
        )

    from_status = queue.status
    queue.status = "SERVED"
    queue.served_at = datetime.now()

    add_queue_event(db, queue, "SERVED", from_status, "SERVED", "입장 완료")

    db.commit()
    db.refresh(queue)

    return queue


def mark_no_show(db: Session, queue_id: int):
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    if queue.status not in ("CALLED", "ARRIVED"):
        raise HTTPException(
            status_code=400,
            detail="Only CALLED or ARRIVED queue can be marked as no-show",
        )

    from_status = queue.status
    queue.status = "NO_SHOW"
    queue.no_show_at = datetime.now()

    add_queue_event(db, queue, "NO_SHOW", from_status, "NO_SHOW", "노쇼 처리")

    db.commit()
    db.refresh(queue)

    return queue
