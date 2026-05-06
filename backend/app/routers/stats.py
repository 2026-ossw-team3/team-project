from fastapi import APIRouter


router = APIRouter(
    tags=["Stats"],
)


# Week4 구현 예정
# GET /api/stores/{store_id}/stats/summary
# GET /api/stores/{store_id}/stats/hourly
# GET /api/stores/{store_id}/stats