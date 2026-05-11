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

from sqlalchemy.orm import Session

from app.models import QueueEntry


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
