from fastapi import APIRouter


router = APIRouter(
    prefix="/api/queues",
    tags=["Queues"],
)


# Week2 구현 예정
# POST /api/queues
# GET /api/queues/{queue_id}?code={access_code}
# DELETE /api/queues/{queue_id}?code={access_code}
# POST /api/queues/{queue_id}/confirm-arrival?code={access_code}