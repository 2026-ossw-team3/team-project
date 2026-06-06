from datetime import date, datetime

from pydantic import BaseModel, Field


class QueueCreateRequest(BaseModel):
    store_id: int
    nickname: str = Field(min_length=1, max_length=50)
    party_size: int = Field(ge=1, le=10)


class QueueCreateResponse(BaseModel):
    queue_id: int
    store_id: int
    queue_number: int
    access_code: str
    status: str
    estimated_wait_time: int


class QueueDetailResponse(BaseModel):
    queue_id: int
    store_id: int
    store_name: str
    queue_date: date
    queue_number: int
    nickname: str
    party_size: int
    status: str
    ahead_count: int
    estimated_wait_time: int
    created_at: datetime | None = None
    called_at: datetime | None = None
    arrived_at: datetime | None = None
    served_at: datetime | None = None
    canceled_at: datetime | None = None
    no_show_at: datetime | None = None


class QueueCancelResponse(BaseModel):
    queue_id: int
    status: str
    canceled_at: datetime | None = None
    message: str


class QueueArrivalConfirmResponse(BaseModel):
    queue_id: int
    status: str
    arrived_at: datetime | None = None
    message: str