from pydantic import BaseModel


class StoreResponse(BaseModel):
    id: int
    name: str
    location: str | None = None
    description: str | None = None
    average_service_time: int
    is_active: bool

    class Config:
        from_attributes = True