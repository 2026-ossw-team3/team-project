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


class AdminDashboardResponse(BaseModel):
    store_id: int
    current_waiting_count: int
    active_queue_count: int
    called_count: int
    arrived_count: int
    today_registered_count: int
    today_served_count: int
    today_no_show_count: int
    average_wait_time: float
    average_service_time: float
    congestion_level: str
