# Week3 구현 예정
# 운영자 대기열 관리와 상태 전환 로직을 담당한다.
#
# 예정 함수:
# - get_admin_queue_list
# - call_next_queue
# - call_queue
# - serve_queue
# - mark_no_show
# - get_admin_dashboard
# KAN-20 구현: call_next_queue, call_queue
# KAN-21 구현: serve_queue, mark_no_show
# KAN-22 구현: get_admin_dashboard

from datetime import date, datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import QueueEntry, QueueEvent


ACTIVE_QUEUE_STATUSES = ("WAITING", "CALLED", "ARRIVED")


def get_queue_or_404(db: Session, queue_id: int) -> QueueEntry:
    queue = db.query(QueueEntry).filter(QueueEntry.id == queue_id).first()

    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    return queue


def calculate_average_minutes(queues, start_field: str, end_field: str) -> float:
    durations = []

    for queue in queues:
        start_time = getattr(queue, start_field)
        end_time = getattr(queue, end_field)

        if not start_time or not end_time:
            continue

        durations.append((end_time - start_time).total_seconds() / 60)

    if not durations:
        return 0.0

    return round(sum(durations) / len(durations), 1)


def get_congestion_level(active_queue_count: int) -> str:
    if active_queue_count >= 15:
        return "HIGH"

    if active_queue_count >= 5:
        return "MEDIUM"

    return "LOW"


def get_admin_queue_list(db: Session, store_id: int):
    today = date.today()

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
    today = date.today()

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
    served_queues = [queue for queue in today_queues if queue.status == "SERVED"]

    return {
        "store_id": store_id,
        "current_waiting_count": current_waiting_count,
        "active_queue_count": active_queue_count,
        "called_count": called_count,
        "arrived_count": arrived_count,
        "today_registered_count": len(today_queues),
        "today_served_count": today_served_count,
        "today_no_show_count": today_no_show_count,
        "average_wait_time": calculate_average_minutes(
            served_queues,
            "created_at",
            "served_at",
        ),
        "average_service_time": calculate_average_minutes(
            served_queues,
            "called_at",
            "served_at",
        ),
        "congestion_level": get_congestion_level(active_queue_count),
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
    queue.called_at = datetime.now()

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
    queue.served_at = datetime.now()

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
    queue.no_show_at = datetime.now()

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