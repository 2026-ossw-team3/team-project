from fastapi import APIRouter


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


# Week3 구현 예정
# GET /api/admin/stores/{store_id}/queues
# POST /api/admin/stores/{store_id}/call-next
# POST /api/admin/queues/{queue_id}/call
# POST /api/admin/queues/{queue_id}/serve
# POST /api/admin/queues/{queue_id}/no-show
# GET /api/admin/stores/{store_id}/dashboard