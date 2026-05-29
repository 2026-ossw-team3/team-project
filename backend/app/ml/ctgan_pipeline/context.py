from __future__ import annotations

from datetime import date
from typing import Any

import pandas as pd

from app.ml.common.time_features import (
    LUNCH_END_MINUTES,
    LUNCH_START_MINUTES,
    WEEKDAY_LABELS,
)


def build_weekday_date_candidates(
    *dataframes: pd.DataFrame,
) -> dict[str, list[date]]:
    candidates: dict[str, list[date]] = {
        weekday: [] for weekday in WEEKDAY_LABELS.values()
    }

    for df in dataframes:
        unique_dates = pd.to_datetime(df["date"]).dt.date.drop_duplicates()

        for current_date in unique_dates:
            weekday = WEEKDAY_LABELS[current_date.weekday()]
            if current_date not in candidates[weekday]:
                candidates[weekday].append(current_date)

    for weekday in candidates:
        candidates[weekday].sort()

    return candidates


def build_sanitize_context(source_df: pd.DataFrame) -> dict[str, Any]:
    valid_time_minutes = sorted(
        {
            int(round(value))
            for value in source_df["time_minutes"].tolist()
            if pd.notna(value)
        }
    )

    if not valid_time_minutes:
        valid_time_minutes = [11 * 60, 12 * 60, 13 * 60]

    min_time_minutes = min(valid_time_minutes)
    max_time_minutes = max(valid_time_minutes)

    lunch_time_minutes = [
        value
        for value in valid_time_minutes
        if LUNCH_START_MINUTES <= value < LUNCH_END_MINUTES
    ]

    non_lunch_time_minutes = [
        value
        for value in valid_time_minutes
        if not (LUNCH_START_MINUTES <= value < LUNCH_END_MINUTES)
    ]

    if not lunch_time_minutes:
        lunch_time_minutes = [LUNCH_START_MINUTES]

    if not non_lunch_time_minutes:
        non_lunch_time_minutes = [min_time_minutes]

    return {
        "valid_time_minutes": valid_time_minutes,
        "lunch_time_minutes": lunch_time_minutes,
        "non_lunch_time_minutes": non_lunch_time_minutes,
        "min_time_minutes": min_time_minutes,
        "max_time_minutes": max_time_minutes,
    }