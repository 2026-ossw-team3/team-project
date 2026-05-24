from datetime import date

from pydantic import BaseModel


class StatsSummaryResponse(BaseModel):
    store_id: int
    date: date
    today_registered_count: int
    today_served_count: int
    today_no_show_count: int
    current_waiting_count: int
    active_queue_count: int
    called_count: int
    arrived_count: int