from __future__ import annotations

from datetime import date
from typing import Any

import pandas as pd

from app.ml.common.time_features import (
    LUNCH_END_MINUTES,
    LUNCH_START_MINUTES,
    WEEKDAY_LABELS,
    add_minutes_to_time,
    format_minutes_to_time,
)
from app.ml.common.wait_data import TARGET_COLUMN
from app.ml.ctgan_pipeline.config import (
    MAX_PICKUP_MINUTES,
    MAX_QUEUE_AHEAD_TEAM_COUNT,
    MAX_TOTAL_WAIT_MINUTES,
    MIN_PICKUP_MINUTES,
    MIN_QUEUE_AHEAD_TEAM_COUNT,
    MIN_TOTAL_WAIT_MINUTES,
    STORE_NAMES,
)


def get_valid_weekday(value: Any) -> str:
    valid_weekdays = set(WEEKDAY_LABELS.values())
    weekday = str(value)

    if weekday in valid_weekdays:
        return weekday

    return "MON"


def get_valid_store_id(value: Any) -> int:
    try:
        store_id = int(float(value))
    except (TypeError, ValueError):
        return 1

    if store_id in STORE_NAMES:
        return store_id

    return 1


def get_date_for_weekday(
    weekday: str,
    row_index: int,
    weekday_date_candidates: dict[str, list[date]],
) -> date:
    candidates = weekday_date_candidates.get(weekday, [])

    if candidates:
        return candidates[row_index % len(candidates)]

    all_candidates = [
        current_date
        for date_candidates in weekday_date_candidates.values()
        for current_date in date_candidates
    ]

    if all_candidates:
        return all_candidates[row_index % len(all_candidates)]

    return date(2026, 5, 1)


def clamp_int(value: Any, min_value: int, max_value: int, default: int) -> int:
    try:
        normalized_value = int(round(float(value)))
    except (TypeError, ValueError):
        return default

    return max(min_value, min(max_value, normalized_value))


def pick_context_time(
    candidates: list[int],
    row_index: int,
    fallback: int,
) -> int:
    if candidates:
        return candidates[row_index % len(candidates)]

    return fallback


def normalize_time_minutes(
    raw_time_minutes: Any,
    is_lunch: int,
    row_index: int,
    sanitize_context: dict[str, Any],
) -> int:
    min_time_minutes = sanitize_context["min_time_minutes"]
    max_time_minutes = sanitize_context["max_time_minutes"]

    try:
        time_minutes = int(round(float(raw_time_minutes)))
    except (TypeError, ValueError):
        return pick_context_time(
            candidates=sanitize_context["valid_time_minutes"],
            row_index=row_index,
            fallback=LUNCH_START_MINUTES if is_lunch else min_time_minutes,
        )

    if time_minutes < min_time_minutes or time_minutes > max_time_minutes:
        candidates = (
            sanitize_context["lunch_time_minutes"]
            if is_lunch
            else sanitize_context["non_lunch_time_minutes"]
        )

        return pick_context_time(
            candidates=candidates,
            row_index=row_index,
            fallback=LUNCH_START_MINUTES if is_lunch else min_time_minutes,
        )

    if is_lunch == 1 and not (LUNCH_START_MINUTES <= time_minutes < LUNCH_END_MINUTES):
        return pick_context_time(
            candidates=sanitize_context["lunch_time_minutes"],
            row_index=row_index,
            fallback=LUNCH_START_MINUTES,
        )

    if is_lunch == 0 and LUNCH_START_MINUTES <= time_minutes < LUNCH_END_MINUTES:
        return pick_context_time(
            candidates=sanitize_context["non_lunch_time_minutes"],
            row_index=row_index,
            fallback=min_time_minutes,
        )

    return time_minutes


def sanitize_synthetic_row(
    row: pd.Series,
    row_index: int,
    weekday_date_candidates: dict[str, list[date]],
    sanitize_context: dict[str, Any],
) -> dict[str, Any]:
    weekday = get_valid_weekday(row["weekday"])
    current_date = get_date_for_weekday(
        weekday=weekday,
        row_index=row_index,
        weekday_date_candidates=weekday_date_candidates,
    )

    is_lunch = clamp_int(
        value=row["is_lunch_time"],
        min_value=0,
        max_value=1,
        default=0,
    )

    time_minutes = normalize_time_minutes(
        raw_time_minutes=row["time_minutes"],
        is_lunch=is_lunch,
        row_index=row_index,
        sanitize_context=sanitize_context,
    )

    queue_ahead_team_count = clamp_int(
        value=row["queue_ahead_team_count"],
        min_value=MIN_QUEUE_AHEAD_TEAM_COUNT,
        max_value=MAX_QUEUE_AHEAD_TEAM_COUNT,
        default=0,
    )

    store_id = get_valid_store_id(row["store_id"])

    post_payment_pickup_minutes = clamp_int(
        value=row["post_payment_pickup_minutes"],
        min_value=MIN_PICKUP_MINUTES,
        max_value=MAX_PICKUP_MINUTES,
        default=6,
    )

    total_wait_minutes = clamp_int(
        value=row[TARGET_COLUMN],
        min_value=MIN_TOTAL_WAIT_MINUTES,
        max_value=MAX_TOTAL_WAIT_MINUTES,
        default=post_payment_pickup_minutes,
    )

    minimum_total_wait_minutes = post_payment_pickup_minutes

    if queue_ahead_team_count > 0:
        minimum_total_wait_minutes = post_payment_pickup_minutes + 1

    if total_wait_minutes < minimum_total_wait_minutes:
        total_wait_minutes = minimum_total_wait_minutes

    kiosk_wait_minutes = total_wait_minutes - post_payment_pickup_minutes

    queue_entered_at = format_minutes_to_time(time_minutes)
    payment_completed_at = add_minutes_to_time(
        base_date=current_date,
        base_time_minutes=time_minutes,
        minutes=kiosk_wait_minutes,
    )

    return {
        "date": current_date.isoformat(),
        "queue_entered_at": queue_entered_at,
        "queue_ahead_team_count": queue_ahead_team_count,
        "payment_completed_at": payment_completed_at,
        "store_id": store_id,
        "store_name": STORE_NAMES[store_id],
        "post_payment_pickup_minutes": post_payment_pickup_minutes,
    }