from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent
from app.utils.datetime import now_kst, today_kst


ACTIVE_QUEUE_STATUSES = ("WAITING", "CALLED", "ARRIVED")


def get_queue_or_404(db: Session, queue_id: int) -> QueueEntry:
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    return queue


def get_admin_queue_list(db: Session, store_id: int):
    today = today_kst()

    return (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .order_by(
            QueueEntry.queue_number.asc(),
        )
        .all()
    )


def get_admin_dashboard(db: Session, store_id: int):
    today = today_kst()

    today_queues = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
        )
        .all()
    )

    current_waiting_count = 0
    called_count = 0
    arrived_count = 0
    today_served_count = 0
    today_no_show_count = 0

    for queue in today_queues:
        if queue.status == "WAITING":
            current_waiting_count += 1
        elif queue.status == "CALLED":
            called_count += 1
        elif queue.status == "ARRIVED":
            arrived_count += 1
        elif queue.status == "SERVED":
            today_served_count += 1
        elif queue.status == "NO_SHOW":
            today_no_show_count += 1

    active_queue_count = current_waiting_count + called_count + arrived_count

    return {
        "store_id": store_id,
        "current_waiting_count": current_waiting_count,
        "active_queue_count": active_queue_count,
        "called_count": called_count,
        "arrived_count": arrived_count,
        "today_registered_count": len(today_queues),
        "today_served_count": today_served_count,
        "today_no_show_count": today_no_show_count,
    }


def create_queue_event(
    db: Session,
    queue: QueueEntry,
    event_type: str,
    from_status: str | None,
    to_status: str,
    memo: str,
) -> None:
    event = QueueEvent(
        queue_entry_id=queue.id,
        store_id=queue.store_id,
        event_type=event_type,
        from_status=from_status,
        to_status=to_status,
        memo=memo,
    )
    db.add(event)


def call_next_queue(db: Session, store_id: int):
    queue = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today_kst(),
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
    queue.called_at = now_kst()

    create_queue_event(
        db=db,
        queue=queue,
        event_type="CALLED",
        from_status="WAITING",
        to_status="CALLED",
        memo="운영자 호출",
    )

    db.commit()
    db.refresh(queue)

    return queue


def call_queue(db: Session, queue_id: int):
    queue = get_queue_or_404(db, queue_id)

    if queue.status != "WAITING":
        raise HTTPException(
            status_code=400,
            detail="Only WAITING queue can be called",
        )

    queue.status = "CALLED"
    queue.called_at = now_kst()

    create_queue_event(
        db=db,
        queue=queue,
        event_type="CALLED",
        from_status="WAITING",
        to_status="CALLED",
        memo="운영자 호출",
    )

    db.commit()
    db.refresh(queue)

    return queue


def serve_queue(db: Session, queue_id: int):
    queue = get_queue_or_404(db, queue_id)

    if queue.status not in ("CALLED", "ARRIVED"):
        raise HTTPException(
            status_code=400,
            detail="Only CALLED or ARRIVED queue can be served",
        )

    from_status = queue.status
    queue.status = "SERVED"
    queue.served_at = now_kst()

    create_queue_event(
        db=db,
        queue=queue,
        event_type="SERVED",
        from_status=from_status,
        to_status="SERVED",
        memo="입장 완료",
    )

    db.commit()
    db.refresh(queue)

    return queue


def mark_no_show(db: Session, queue_id: int):
    queue = get_queue_or_404(db, queue_id)

    if queue.status != "CALLED":
        raise HTTPException(
            status_code=400,
            detail="Only CALLED queue can be marked as no-show",
        )

    from_status = queue.status
    queue.status = "NO_SHOW"
    queue.no_show_at = now_kst()

    create_queue_event(
        db=db,
        queue=queue,
        event_type="NO_SHOW",
        from_status=from_status,
        to_status="NO_SHOW",
        memo="노쇼 처리",
    )

    db.commit()
    db.refresh(queue)

    return queue