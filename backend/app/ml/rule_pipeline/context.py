from __future__ import annotations

from datetime import date
from typing import Any

import pandas as pd

from app.ml.rule_pipeline.config import FALLBACK_STORE_CONFIGS


def build_weekday_dates_from_actual_data_range(
    actual_df: pd.DataFrame,
) -> list[date]:
    """Build weekday dates within the observed actual data date range.

    Rule-based augmentation uses weekdays in the same collection period
    as actual_wait_data.csv instead of fixed hard-coded dates.
    """

    if actual_df.empty:
        raise ValueError("Actual wait data must not be empty.")

    actual_dates = pd.to_datetime(actual_df["date"]).dt.date
    min_date = actual_dates.min()
    max_date = actual_dates.max()

    weekday_dates = [
        current_date.date()
        for current_date in pd.date_range(min_date, max_date)
        if current_date.weekday() < 5
    ]

    if weekday_dates:
        return weekday_dates

    # Fallback for an unusual case where the observed range contains no weekdays.
    return sorted(actual_dates.drop_duplicates().tolist())


def build_store_configs_from_actual_data(
    actual_df: pd.DataFrame,
) -> dict[int, dict[str, Any]]:
    """Build store configs using actual pickup-time observations first.

    The rule-based augmentation uses each store's median
    post_payment_pickup_minutes from actual_wait_data.csv.
    If a store has no actual observations yet, fallback seed-based values are used.
    """

    store_configs = {
        store_id: config.copy()
        for store_id, config in FALLBACK_STORE_CONFIGS.items()
    }

    normalized_df = actual_df.copy()
    normalized_df["store_id"] = normalized_df["store_id"].astype(int)
    normalized_df["store_name"] = normalized_df["store_name"].astype(str)
    normalized_df["post_payment_pickup_minutes"] = normalized_df[
        "post_payment_pickup_minutes"
    ].astype(int)

    median_pickup_by_store = (
        normalized_df.groupby("store_id")["post_payment_pickup_minutes"]
        .median()
        .to_dict()
    )

    store_name_by_store = (
        normalized_df.sort_values("date")
        .groupby("store_id")["store_name"]
        .last()
        .to_dict()
    )

    for store_id, median_pickup_minutes in median_pickup_by_store.items():
        store_configs[int(store_id)] = {
            "store_name": store_name_by_store.get(
                store_id,
                FALLBACK_STORE_CONFIGS.get(store_id, {}).get(
                    "store_name",
                    f"store-{store_id}",
                ),
            ),
            "store_base_pickup_minutes": max(
                2,
                int(round(float(median_pickup_minutes))),
            ),
        }

    return store_configs