# Week3 구현 예정
# AdminQueueItemResponse
# AdminQueueListResponse
# QueueActionResponse
# AdminDashboardResponse

from datetime import date, datetime

from pydantic import BaseModel


class AdminQueueItemResponse(BaseModel):
    id: int
    store_id: int
    queue_date: date
    queue_number: int
    nickname: str
    party_size: int
    status: str
    created_at: datetime
    called_at: datetime | None = None
    arrived_at: datetime | None = None
    served_at: datetime | None = None
    canceled_at: datetime | None = None
    no_show_at: datetime | None = None

    class Config:
        from_attributes = True


class AdminQueueListResponse(BaseModel):
    store_id: int
    queues: list[AdminQueueItemResponse]


class QueueActionResponse(BaseModel):
    queue: AdminQueueItemResponse
    message: str