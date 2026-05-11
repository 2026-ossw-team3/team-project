from enum import Enum


class QueueStatus(str, Enum):
    WAITING = "WAITING"
    CALLED = "CALLED"
    ARRIVED = "ARRIVED"
    SERVED = "SERVED"
    CANCELED = "CANCELED"
    NO_SHOW = "NO_SHOW"


class QueueEventType(str, Enum):
    REGISTERED = "REGISTERED"
    CALLED = "CALLED"
    ARRIVED = "ARRIVED"
    SERVED = "SERVED"
    CANCELED = "CANCELED"
    NO_SHOW = "NO_SHOW"


ALLOWED_STATUS_TRANSITIONS = {
    QueueStatus.WAITING: {
        QueueStatus.CALLED,
        QueueStatus.CANCELED,
    },
    QueueStatus.CALLED: {
        QueueStatus.ARRIVED,
        QueueStatus.SERVED,
        QueueStatus.CANCELED,
        QueueStatus.NO_SHOW,
    },
    QueueStatus.ARRIVED: {
        QueueStatus.SERVED,
    },
    QueueStatus.SERVED: set(),
    QueueStatus.CANCELED: set(),
    QueueStatus.NO_SHOW: set(),
}


TERMINAL_QUEUE_STATUSES = {
    QueueStatus.SERVED,
    QueueStatus.CANCELED,
    QueueStatus.NO_SHOW,
}