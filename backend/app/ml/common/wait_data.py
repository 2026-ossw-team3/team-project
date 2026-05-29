from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split

from app.ml.common.time_features import (
    calculate_wait_minutes,
    get_weekday_label,
    is_lunch_time,
    parse_time_to_minutes,
)


RANDOM_STATE = 42

SOURCE_COLUMNS = [
    "date",
    "queue_entered_at",
    "queue_ahead_team_count",
    "payment_completed_at",
    "store_id",
    "store_name",
    "post_payment_pickup_minutes",
]

TRAINING_FEATURE_COLUMNS = [
    "weekday",
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
    "store_id",
]

TARGET_COLUMN = "total_wait_minutes"


def validate_required_file(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Required data file not found: {path}")


def validate_columns(df: pd.DataFrame, path: Path) -> None:
    missing_columns = [column for column in SOURCE_COLUMNS if column not in df.columns]

    if missing_columns:
        raise ValueError(
            f"{path} is missing required columns: {', '.join(missing_columns)}"
        )


def load_wait_data(path: Path) -> pd.DataFrame:
    validate_required_file(path)

    df = pd.read_csv(path)
    validate_columns(df, path)

    return df


def add_training_columns(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()

    result["date"] = pd.to_datetime(result["date"]).dt.date
    result["weekday"] = result["date"].apply(get_weekday_label)
    result["date"] = result["date"].astype(str)

    result["time_minutes"] = result["queue_entered_at"].apply(parse_time_to_minutes)
    result["is_lunch_time"] = result["time_minutes"].apply(is_lunch_time)

    result["queue_ahead_team_count"] = result["queue_ahead_team_count"].astype(int)
    result["store_id"] = result["store_id"].astype(str)
    result["post_payment_pickup_minutes"] = result[
        "post_payment_pickup_minutes"
    ].astype(int)

    result[TARGET_COLUMN] = result.apply(
        lambda row: calculate_wait_minutes(
            current_date=row["date"],
            queue_entered_at=row["queue_entered_at"],
            payment_completed_at=row["payment_completed_at"],
            post_payment_pickup_minutes=row["post_payment_pickup_minutes"],
        ),
        axis=1,
    )

    return result


def split_actual_data(actual_df: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
    if len(actual_df) < 4:
        raise ValueError(
            "At least 4 actual data rows are required to create a train/test split."
        )

    test_size = 0.33 if len(actual_df) < 10 else 0.2

    train_df, test_df = train_test_split(
        actual_df,
        test_size=test_size,
        random_state=RANDOM_STATE,
        shuffle=True,
    )

    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)