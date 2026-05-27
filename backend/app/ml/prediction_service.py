from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path
from typing import Any

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.utils.datetime import now_kst  # noqa: E402


MODEL_PATH = BASE_DIR / "models" / "total_wait_model.joblib"

FEATURE_COLUMNS = [
    "weekday",
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
    "store_id",
]

WEEKDAY_LABELS = {
    0: "MON",
    1: "TUE",
    2: "WED",
    3: "THU",
    4: "FRI",
    5: "SAT",
    6: "SUN",
}

STORE_BASE_PICKUP_MINUTES = {
    1: 7,
    2: 6,
    3: 8,
    4: 4,
}

DEFAULT_STORE_BASE_PICKUP_MINUTES = 6
DEFAULT_TEAM_PROCESSING_MINUTES = 0.5
BASE_QUEUE_CORRECTION_MINUTES = 1.0


def get_weekday_label(reference_datetime: datetime) -> str:
    return WEEKDAY_LABELS[reference_datetime.weekday()]


def get_time_minutes(reference_datetime: datetime) -> int:
    return reference_datetime.hour * 60 + reference_datetime.minute


def get_is_lunch_time(time_minutes: int) -> int:
    lunch_start_minutes = 12 * 60
    lunch_end_minutes = 13 * 60

    return int(lunch_start_minutes <= time_minutes < lunch_end_minutes)


def get_predicted_congestion_level(queue_ahead_team_count: int) -> str:
    if queue_ahead_team_count <= 5:
        return "LOW"

    if queue_ahead_team_count <= 15:
        return "MEDIUM"

    return "HIGH"


def load_model() -> Any | None:
    if not MODEL_PATH.exists():
        return None

    return joblib.load(MODEL_PATH)


def calculate_fallback_total_wait_minutes(
    store_id: int,
    queue_ahead_team_count: int,
    is_lunch_time: int,
) -> int:
    store_base_minutes = STORE_BASE_PICKUP_MINUTES.get(
        store_id,
        DEFAULT_STORE_BASE_PICKUP_MINUTES,
    )
    lunch_bonus = 3 if is_lunch_time else 0

    estimated_minutes = (
        queue_ahead_team_count * DEFAULT_TEAM_PROCESSING_MINUTES
        + BASE_QUEUE_CORRECTION_MINUTES
        + store_base_minutes
        + lunch_bonus
    )

    return max(1, round(estimated_minutes))


def build_feature_dataframe(
    store_id: int,
    queue_ahead_team_count: int,
    reference_datetime: datetime,
) -> pd.DataFrame:
    time_minutes = get_time_minutes(reference_datetime)

    feature_data = {
        "weekday": get_weekday_label(reference_datetime),
        "time_minutes": time_minutes,
        "is_lunch_time": get_is_lunch_time(time_minutes),
        "queue_ahead_team_count": int(queue_ahead_team_count),
        "store_id": str(store_id),
    }

    return pd.DataFrame([feature_data], columns=FEATURE_COLUMNS)


def predict_total_wait_minutes(
    store_id: int,
    queue_ahead_team_count: int,
    reference_datetime: datetime | None = None,
) -> dict[str, Any]:
    if reference_datetime is None:
        reference_datetime = now_kst()

    feature_df = build_feature_dataframe(
        store_id=store_id,
        queue_ahead_team_count=queue_ahead_team_count,
        reference_datetime=reference_datetime,
    )

    model = load_model()

    if model is None:
        estimated_total_wait_minutes = calculate_fallback_total_wait_minutes(
            store_id=store_id,
            queue_ahead_team_count=queue_ahead_team_count,
            is_lunch_time=int(feature_df.loc[0, "is_lunch_time"]),
        )

        return {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "fallback_rule",
            "is_fallback": True,
        }

    try:
        prediction = model.predict(feature_df)[0]
        estimated_total_wait_minutes = max(1, round(float(prediction)))

        return {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "RandomForestRegressor",
            "is_fallback": False,
        }

    except Exception:
        estimated_total_wait_minutes = calculate_fallback_total_wait_minutes(
            store_id=store_id,
            queue_ahead_team_count=queue_ahead_team_count,
            is_lunch_time=int(feature_df.loc[0, "is_lunch_time"]),
        )

        return {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "fallback_rule",
            "is_fallback": True,
        }


if __name__ == "__main__":
    import json

    result = predict_total_wait_minutes(
        store_id=1,
        queue_ahead_team_count=7,
    )

    print(json.dumps(result, ensure_ascii=False, indent=2))