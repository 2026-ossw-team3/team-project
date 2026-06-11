from __future__ import annotations

import random
from datetime import date, time
from pathlib import Path
from typing import Any

import pandas as pd

from app.ml.common.time_features import (
    LUNCH_END_MINUTES,
    LUNCH_START_MINUTES,
    add_minutes_to_time,
    format_minutes_to_time,
)
from app.ml.common.wait_data import SOURCE_COLUMNS, load_wait_data
from app.ml.rule_pipeline.config import (
    BASE_QUEUE_CORRECTION_MINUTES,
    RANDOM_SEED,
    RAW_DATA_PATH,
    RULE_DATA_PATH,
    TEAM_PROCESSING_MINUTES,
    TIME_WINDOWS,
)
from app.ml.rule_pipeline.context import (
    build_store_configs_from_actual_data,
    build_weekday_dates_from_actual_data_range,
)


def ensure_output_directory(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)


def set_random_seed() -> None:
    random.seed(RANDOM_SEED)


def is_lunch_peak(value: time) -> bool:
    value_minutes = value.hour * 60 + value.minute

    return LUNCH_START_MINUTES <= value_minutes < LUNCH_END_MINUTES


def time_to_minutes(value: time) -> int:
    return value.hour * 60 + value.minute


def random_time_between(start: time, end: time) -> time:
    start_minutes = time_to_minutes(start)
    end_minutes = time_to_minutes(end)
    selected_minutes = random.randint(start_minutes, end_minutes)

    return time(
        hour=selected_minutes // 60,
        minute=selected_minutes % 60,
    )


def calculate_kiosk_wait_minutes(
    queue_ahead_team_count: int,
    queue_entered_at: time,
) -> int:
    lunch_bonus = random.uniform(1.0, 3.0) if is_lunch_peak(queue_entered_at) else 0
    random_noise = random.uniform(-0.5, 1.0)

    kiosk_wait_minutes = (
        queue_ahead_team_count * TEAM_PROCESSING_MINUTES
        + BASE_QUEUE_CORRECTION_MINUTES
        + lunch_bonus
        + random_noise
    )

    return max(1, round(kiosk_wait_minutes))


def calculate_pickup_minutes(
    store_base_pickup_minutes: int,
    queue_entered_at: time,
) -> int:
    lunch_bonus = random.randint(1, 3) if is_lunch_peak(queue_entered_at) else 0
    random_noise = random.randint(-1, 2)

    pickup_minutes = store_base_pickup_minutes + lunch_bonus + random_noise

    return max(2, pickup_minutes)


def generate_rule_augmented_rows(
    store_configs: dict[int, dict[str, Any]],
    target_dates: list[date],
    rows_per_store_time_window: int = 1,
) -> list[dict]:
    rows = []

    for current_date in target_dates:
        for store_id, store_config in store_configs.items():
            for time_window in TIME_WINDOWS:
                for _ in range(rows_per_store_time_window):
                    queue_entered_at = random_time_between(
                        time_window["start"],
                        time_window["end"],
                    )
                    queue_ahead_team_count = random.randint(
                        time_window["queue_min"],
                        time_window["queue_max"],
                    )

                    kiosk_wait_minutes = calculate_kiosk_wait_minutes(
                        queue_ahead_team_count=queue_ahead_team_count,
                        queue_entered_at=queue_entered_at,
                    )

                    post_payment_pickup_minutes = calculate_pickup_minutes(
                        store_base_pickup_minutes=store_config[
                            "store_base_pickup_minutes"
                        ],
                        queue_entered_at=queue_entered_at,
                    )

                    queue_entered_minutes = time_to_minutes(queue_entered_at)
                    payment_completed_at = add_minutes_to_time(
                        base_date=current_date,
                        base_time_minutes=queue_entered_minutes,
                        minutes=kiosk_wait_minutes,
                    )

                    rows.append(
                        {
                            "date": current_date.isoformat(),
                            "queue_entered_at": format_minutes_to_time(
                                queue_entered_minutes
                            ),
                            "queue_ahead_team_count": queue_ahead_team_count,
                            "payment_completed_at": payment_completed_at,
                            "store_id": store_id,
                            "store_name": store_config["store_name"],
                            "post_payment_pickup_minutes": post_payment_pickup_minutes,
                        }
                    )

    return rows


def generate_rule_augmented_data(
    actual_df: pd.DataFrame,
    rows_per_store_time_window: int = 1,
) -> tuple[pd.DataFrame, dict[int, dict[str, Any]], list[date]]:
    target_dates = build_weekday_dates_from_actual_data_range(actual_df)
    store_configs = build_store_configs_from_actual_data(actual_df)

    generated_rows = generate_rule_augmented_rows(
        store_configs=store_configs,
        target_dates=target_dates,
        rows_per_store_time_window=rows_per_store_time_window,
    )

    generated_df = pd.DataFrame(generated_rows, columns=SOURCE_COLUMNS)

    return generated_df, store_configs, target_dates


def save_rule_augmented_data(
    generated_df: pd.DataFrame,
    output_path: Path = RULE_DATA_PATH,
) -> None:
    generated_df.to_csv(
        output_path,
        index=False,
        encoding="utf-8",
    )


def print_generation_summary(
    generated_df: pd.DataFrame,
    store_configs: dict[int, dict[str, Any]],
    target_dates: list[date],
    output_path: Path,
) -> None:
    print(f"Generated rule augmented data: {output_path}")
    print(f"Generated rows: {len(generated_df)}")
    print(f"Generated date count: {len(target_dates)}")

    if target_dates:
        print(f"Generated date range: {target_dates[0]} ~ {target_dates[-1]}")

    print("Store base pickup minutes:")
    for store_id, store_config in store_configs.items():
        print(
            f"- {store_id} {store_config['store_name']}: "
            f"{store_config['store_base_pickup_minutes']} minutes"
        )


def main() -> None:
    set_random_seed()
    ensure_output_directory(RULE_DATA_PATH)

    actual_df = load_wait_data(RAW_DATA_PATH)

    generated_df, store_configs, target_dates = generate_rule_augmented_data(
        actual_df=actual_df,
    )

    save_rule_augmented_data(
        generated_df=generated_df,
        output_path=RULE_DATA_PATH,
    )

    print_generation_summary(
        generated_df=generated_df,
        store_configs=store_configs,
        target_dates=target_dates,
        output_path=RULE_DATA_PATH,
    )