from __future__ import annotations

import random
from datetime import date, datetime, time, timedelta
from pathlib import Path
from typing import Any

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "actual_wait_data.csv"
GENERATED_DATA_PATH = BASE_DIR / "data" / "generated" / "rule_augmented_wait_data.csv"

RANDOM_SEED = 42

TEAM_PROCESSING_MINUTES = 0.5
BASE_QUEUE_CORRECTION_MINUTES = 1.0

SOURCE_COLUMNS = [
    "date",
    "queue_entered_at",
    "queue_ahead_team_count",
    "payment_completed_at",
    "store_id",
    "store_name",
    "post_payment_pickup_minutes",
]

# 실제 데이터가 아직 없거나 특정 store의 데이터가 부족한 경우 사용할 fallback 값.
# seed.py의 average_service_time 기준과 맞춘 초기값이다.
FALLBACK_STORE_CONFIGS = {
    1: {
        "store_name": "광뚝",
        "store_base_pickup_minutes": 7,
    },
    2: {
        "store_name": "경성카츠",
        "store_base_pickup_minutes": 6,
    },
    3: {
        "store_name": "바비든든",
        "store_base_pickup_minutes": 8,
    },
    4: {
        "store_name": "비비고고",
        "store_base_pickup_minutes": 4,
    },
}

WEEKDAY_DATES = [
    date(2026, 5, 12),  # TUE
    date(2026, 5, 13),  # WED
    date(2026, 5, 14),  # THU
    date(2026, 5, 15),  # FRI
    date(2026, 5, 18),  # MON
    date(2026, 5, 19),  # TUE
    date(2026, 5, 20),  # WED
    date(2026, 5, 21),  # THU
    date(2026, 5, 22),  # FRI
    date(2026, 5, 26),  # TUE
]

TIME_WINDOWS = [
    {
        "start": time(10, 30),
        "end": time(11, 20),
        "queue_min": 0,
        "queue_max": 6,
    },
    {
        "start": time(11, 30),
        "end": time(11, 59),
        "queue_min": 4,
        "queue_max": 18,
    },
    {
        "start": time(12, 0),
        "end": time(12, 59),
        "queue_min": 8,
        "queue_max": 45,
    },
    {
        "start": time(13, 0),
        "end": time(13, 50),
        "queue_min": 1,
        "queue_max": 12,
    },
    {
        "start": time(18, 0),
        "end": time(19, 0),
        "queue_min": 0,
        "queue_max": 10,
    },
]


def ensure_output_directory() -> None:
    GENERATED_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)


def validate_raw_data_exists() -> None:
    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"Actual wait data CSV not found: {RAW_DATA_PATH}"
        )


def validate_columns(df: pd.DataFrame, path: Path) -> None:
    missing_columns = [column for column in SOURCE_COLUMNS if column not in df.columns]

    if missing_columns:
        raise ValueError(
            f"{path} is missing required columns: {', '.join(missing_columns)}"
        )


def load_actual_wait_data() -> pd.DataFrame:
    validate_raw_data_exists()

    actual_df = pd.read_csv(RAW_DATA_PATH)
    validate_columns(actual_df, RAW_DATA_PATH)

    actual_df["store_id"] = actual_df["store_id"].astype(int)
    actual_df["store_name"] = actual_df["store_name"].astype(str)
    actual_df["post_payment_pickup_minutes"] = actual_df[
        "post_payment_pickup_minutes"
    ].astype(int)

    return actual_df


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

    median_pickup_by_store = (
        actual_df.groupby("store_id")["post_payment_pickup_minutes"]
        .median()
        .to_dict()
    )

    store_name_by_store = (
        actual_df.sort_values("date")
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


def is_lunch_peak(value: time) -> bool:
    return time(12, 0) <= value < time(13, 0)


def random_time_between(start: time, end: time) -> time:
    start_minutes = start.hour * 60 + start.minute
    end_minutes = end.hour * 60 + end.minute
    selected_minutes = random.randint(start_minutes, end_minutes)

    return time(
        hour=selected_minutes // 60,
        minute=selected_minutes % 60,
    )


def format_time(value: time) -> str:
    return value.strftime("%H:%M")


def add_minutes_to_time(base_date: date, base_time: time, minutes: int) -> str:
    base_datetime = datetime.combine(base_date, base_time)
    result_datetime = base_datetime + timedelta(minutes=minutes)

    return result_datetime.strftime("%H:%M")


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
    rows_per_store_time_window: int = 1,
) -> list[dict]:
    rows = []

    for current_date in WEEKDAY_DATES:
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

                    payment_completed_at = add_minutes_to_time(
                        base_date=current_date,
                        base_time=queue_entered_at,
                        minutes=kiosk_wait_minutes,
                    )

                    rows.append(
                        {
                            "date": current_date.isoformat(),
                            "queue_entered_at": format_time(queue_entered_at),
                            "queue_ahead_team_count": queue_ahead_team_count,
                            "payment_completed_at": payment_completed_at,
                            "store_id": store_id,
                            "store_name": store_config["store_name"],
                            "post_payment_pickup_minutes": post_payment_pickup_minutes,
                        }
                    )

    return rows


def main() -> None:
    random.seed(RANDOM_SEED)

    ensure_output_directory()

    actual_df = load_actual_wait_data()
    store_configs = build_store_configs_from_actual_data(actual_df)

    generated_rows = generate_rule_augmented_rows(store_configs)
    generated_df = pd.DataFrame(generated_rows)

    generated_df.to_csv(
        GENERATED_DATA_PATH,
        index=False,
        encoding="utf-8",
    )

    print(f"Generated rule augmented data: {GENERATED_DATA_PATH}")
    print(f"Generated rows: {len(generated_df)}")
    print("Store base pickup minutes:")
    for store_id, store_config in store_configs.items():
        print(
            f"- {store_id} {store_config['store_name']}: "
            f"{store_config['store_base_pickup_minutes']} minutes"
        )


if __name__ == "__main__":
    main()