from __future__ import annotations

import json
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


SELECTED_MODEL_PATH = BASE_DIR / "models" / "total_wait_model.joblib"
METRICS_PATH = BASE_DIR / "reports" / "model_metrics.json"

CANDIDATE_MODEL_PATHS = {
    "actual_only": BASE_DIR / "models" / "candidates" / "actual_only_model.joblib",
    "actual_rule": BASE_DIR / "models" / "candidates" / "actual_rule_model.joblib",
    # CTGAN 모델은 후속 작업에서 파일이 생성되면 자동으로 후보 예측에 포함할 수 있다.
    "actual_rule_ctgan": (
        BASE_DIR / "models" / "candidates" / "actual_rule_ctgan_model.joblib"
    ),
}

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

    if queue_ahead_team_count <= 10:
        return "MEDIUM"

    return "HIGH"


def load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_model(path: Path) -> Any | None:
    if not path.exists():
        return None

    return joblib.load(path)


def load_model_metrics() -> dict[str, Any]:
    return load_json(METRICS_PATH)


def get_selected_model_name(metrics: dict[str, Any]) -> str | None:
    selected_model = metrics.get("selected_model")

    if isinstance(selected_model, str) and selected_model:
        return selected_model

    return None


def get_candidate_mae(metrics: dict[str, Any], model_name: str) -> float | None:
    result = metrics.get("results", {}).get(model_name, {})
    mae = result.get("mae")

    if mae is None:
        return None

    return float(mae)


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


def predict_with_model(model: Any, feature_df: pd.DataFrame) -> int:
    prediction = model.predict(feature_df)[0]

    return max(1, round(float(prediction)))


def build_candidate_predictions(
    feature_df: pd.DataFrame,
    metrics: dict[str, Any],
) -> dict[str, dict[str, Any]]:
    candidate_predictions = {}

    for model_name, model_path in CANDIDATE_MODEL_PATHS.items():
        if not model_path.exists():
            continue

        try:
            model = load_model(model_path)
            estimated_total_wait_minutes = predict_with_model(model, feature_df)

            candidate_predictions[model_name] = {
                "estimated_total_wait_minutes": estimated_total_wait_minutes,
                "mae": get_candidate_mae(metrics, model_name),
                "model_type": "RandomForestRegressor",
                "is_available": True,
            }

        except Exception as error:
            candidate_predictions[model_name] = {
                "estimated_total_wait_minutes": None,
                "mae": get_candidate_mae(metrics, model_name),
                "model_type": "RandomForestRegressor",
                "is_available": False,
                "error": str(error),
            }

    return candidate_predictions


def predict_total_wait_minutes(
    store_id: int,
    queue_ahead_team_count: int,
    reference_datetime: datetime | None = None,
    include_candidates: bool = True,
) -> dict[str, Any]:
    if reference_datetime is None:
        reference_datetime = now_kst()

    feature_df = build_feature_dataframe(
        store_id=store_id,
        queue_ahead_team_count=queue_ahead_team_count,
        reference_datetime=reference_datetime,
    )

    metrics = load_model_metrics()
    selected_model_name = get_selected_model_name(metrics)

    selected_model = load_model(SELECTED_MODEL_PATH)

    if selected_model is None:
        estimated_total_wait_minutes = calculate_fallback_total_wait_minutes(
            store_id=store_id,
            queue_ahead_team_count=queue_ahead_team_count,
            is_lunch_time=int(feature_df.loc[0, "is_lunch_time"]),
        )

        result = {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "selected_model": "fallback_rule",
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "fallback_rule",
            "is_fallback": True,
        }

        if include_candidates:
            result["candidate_predictions"] = {}

        return result

    try:
        estimated_total_wait_minutes = predict_with_model(selected_model, feature_df)

        result = {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "selected_model": selected_model_name,
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "RandomForestRegressor",
            "is_fallback": False,
        }

        if include_candidates:
            result["candidate_predictions"] = build_candidate_predictions(
                feature_df=feature_df,
                metrics=metrics,
            )

        return result

    except Exception:
        estimated_total_wait_minutes = calculate_fallback_total_wait_minutes(
            store_id=store_id,
            queue_ahead_team_count=queue_ahead_team_count,
            is_lunch_time=int(feature_df.loc[0, "is_lunch_time"]),
        )

        result = {
            "store_id": store_id,
            "queue_ahead_team_count": queue_ahead_team_count,
            "selected_model": "fallback_rule",
            "estimated_total_wait_minutes": estimated_total_wait_minutes,
            "predicted_congestion_level": get_predicted_congestion_level(
                queue_ahead_team_count
            ),
            "model_type": "fallback_rule",
            "is_fallback": True,
        }

        if include_candidates:
            result["candidate_predictions"] = build_candidate_predictions(
                feature_df=feature_df,
                metrics=metrics,
            )

        return result


if __name__ == "__main__":
    test_store_id = 2
    test_queue_ahead_team_count = 4
    reference_datetime = now_kst()

    feature_df = build_feature_dataframe(
        store_id=test_store_id,
        queue_ahead_team_count=test_queue_ahead_team_count,
        reference_datetime=reference_datetime,
    )

    result = predict_total_wait_minutes(
        store_id=test_store_id,
        queue_ahead_team_count=test_queue_ahead_team_count,
        reference_datetime=reference_datetime,
        include_candidates=True,
    )

    test_output = {
        "test_features": {
            "reference_datetime": reference_datetime.strftime("%Y-%m-%d %H:%M:%S"),
            "weekday": feature_df.loc[0, "weekday"],
            "time_minutes": int(feature_df.loc[0, "time_minutes"]),
            "is_lunch_time": int(feature_df.loc[0, "is_lunch_time"]),
            "store_id": test_store_id,
            "queue_ahead_team_count": test_queue_ahead_team_count,
        },
        "prediction_result": result,
    }

    print(json.dumps(test_output, ensure_ascii=False, indent=2))