from datetime import datetime, time, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.constants import QueueEventType, QueueStatus
from app.models import QueueEntry, QueueEvent, Store
from app.utils.datetime import today_kst


ACTIVE_QUEUE_STATUSES = (
    QueueStatus.WAITING.value,
    QueueStatus.CALLED.value,
    QueueStatus.ARRIVED.value,
)


def get_store_or_404(db: Session, store_id: int) -> Store:
    store = db.query(Store).filter(Store.id == store_id).first()

    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="STORE_NOT_FOUND",
        )

    return store


def get_today_range():
    today = today_kst()
    start_at = datetime.combine(today, time.min)
    end_at = start_at + timedelta(days=1)

    return today, start_at, end_at


def count_today_events(
    db: Session,
    store_id: int,
    event_type: QueueEventType,
    start_at: datetime,
    end_at: datetime,
) -> int:
    return (
        db.query(QueueEvent)
        .filter(
            QueueEvent.store_id == store_id,
            QueueEvent.event_type == event_type.value,
            QueueEvent.created_at >= start_at,
            QueueEvent.created_at < end_at,
        )
        .count()
    )


def get_stats_summary(db: Session, store_id: int):
    get_store_or_404(db, store_id)

    today, start_at, end_at = get_today_range()

    current_waiting_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
            QueueEntry.status == QueueStatus.WAITING.value,
        )
        .count()
    )

    called_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
            QueueEntry.status == QueueStatus.CALLED.value,
        )
        .count()
    )

    arrived_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
            QueueEntry.status == QueueStatus.ARRIVED.value,
        )
        .count()
    )

    active_queue_count = (
        db.query(QueueEntry)
        .filter(
            QueueEntry.store_id == store_id,
            QueueEntry.queue_date == today,
            QueueEntry.status.in_(ACTIVE_QUEUE_STATUSES),
        )
        .count()
    )

    today_registered_count = count_today_events(
        db=db,
        store_id=store_id,
        event_type=QueueEventType.REGISTERED,
        start_at=start_at,
        end_at=end_at,
    )

    today_served_count = count_today_events(
        db=db,
        store_id=store_id,
        event_type=QueueEventType.SERVED,
        start_at=start_at,
        end_at=end_at,
    )

    today_no_show_count = count_today_events(
        db=db,
        store_id=store_id,
        event_type=QueueEventType.NO_SHOW,
        start_at=start_at,
        end_at=end_at,
    )

    return {
        "store_id": store_id,
        "date": today,
        "today_registered_count": today_registered_count,
        "today_served_count": today_served_count,
        "today_no_show_count": today_no_show_count,
        "current_waiting_count": current_waiting_count,
        "active_queue_count": active_queue_count,
        "called_count": called_count,
        "arrived_count": arrived_count,
    }