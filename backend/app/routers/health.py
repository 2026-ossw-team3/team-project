from fastapi import APIRouter
from pydantic import BaseModel


router = APIRouter(
    tags=["Health"],
)


class RootResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    message: str


@router.get("/", response_model=RootResponse, tags=["Root"])
def root():
    return {
        "message": "Virtual Queue API is running"
    }


@router.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "message": "Backend is running"
    }