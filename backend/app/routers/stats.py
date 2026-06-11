from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.stats import StatsSummaryResponse
from app.services.stats_service import get_stats_summary


router = APIRouter(
    tags=["Stats"],
)


@router.get(
    "/api/stores/{store_id}/stats/summary",
    response_model=StatsSummaryResponse,
)
def get_store_stats_summary(
    store_id: int,
    db: Session = Depends(get_db),
):
    return get_stats_summary(db, store_id)