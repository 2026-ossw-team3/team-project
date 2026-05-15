# Week3 구현 예정
# 운영자 대기열 관리와 상태 전환 로직을 담당한다.
#
# 예정 함수:
# - get_admin_queue_list
# - call_next_queue
# - call_queue
# - serve_queue
# - mark_no_show
# KAN-20 구현 예정: call_next_queue, call_queue
# KAN-21 구현 예정: serve_queue, mark_no_show


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



def add_called_event(db: Session, queue: QueueEntry):
    db.add(


        QueueEvent(
            queue_entry_id=queue.id,
            store_id=queue.store_id,
            event_type="CALLED",
            from_status="WAITING",
            to_status="CALLED",
            memo="운영자 호출",
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
        raise HTTPException(
            status_code=404,
            detail="Waiting queue not found",
        )

    queue.status = "CALLED"
    queue.called_at = datetime.now()
    add_called_event(db, queue)

    db.commit()
    db.refresh(queue)

    return queue



def call_queue(db: Session, queue_id: int):
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(
            status_code=404,
            detail="Queue not found",
        )

    if queue.status != "WAITING":
        raise HTTPException(
            status_code=400,
            detail="Only WAITING queue can be called",
        )

    queue.status = "CALLED"
    queue.called_at = datetime.now()
    add_called_event(db, queue)

    db.commit()
    db.refresh(queue)

    return queue
