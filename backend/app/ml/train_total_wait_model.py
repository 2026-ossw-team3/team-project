from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.ml.common.wait_data import (  # noqa: E402
    RANDOM_STATE,
    TARGET_COLUMN,
    TRAINING_FEATURE_COLUMNS,
    add_training_columns,
    load_wait_data,
    split_actual_data,
)


RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "actual_wait_data.csv"
RULE_DATA_PATH = BASE_DIR / "data" / "generated" / "rule_augmented_wait_data.csv"

CANDIDATE_MODEL_DIR = BASE_DIR / "models" / "candidates"
CANDIDATE_MODEL_PATHS = {
    "actual_only": CANDIDATE_MODEL_DIR / "actual_only_model.joblib",
    "actual_rule": CANDIDATE_MODEL_DIR / "actual_rule_model.joblib",
}

SELECTED_MODEL_PATH = BASE_DIR / "models" / "total_wait_model.joblib"

REPORT_DIR = BASE_DIR / "reports"
METRICS_PATH = REPORT_DIR / "model_metrics.json"

FEATURE_COLUMNS = TRAINING_FEATURE_COLUMNS

CATEGORICAL_FEATURES = [
    "weekday",
    "store_id",
]

NUMERIC_FEATURES = [
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
]


def ensure_output_directories() -> None:
    CANDIDATE_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    SELECTED_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)


def create_model_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
            (
                "numeric",
                "passthrough",
                NUMERIC_FEATURES,
            ),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=200,
        random_state=RANDOM_STATE,
        min_samples_leaf=1,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )


def load_training_data(path: Path) -> pd.DataFrame:
    return add_training_columns(load_wait_data(path))


def train_and_evaluate(
    train_df: pd.DataFrame,
    test_df: pd.DataFrame,
    model_path: Path,
) -> dict[str, Any]:
    model = create_model_pipeline()

    x_train = train_df[FEATURE_COLUMNS]
    y_train = train_df[TARGET_COLUMN]

    x_test = test_df[FEATURE_COLUMNS]
    y_test = test_df[TARGET_COLUMN]

    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    mae = mean_absolute_error(y_test, predictions)

    joblib.dump(model, model_path)

    return {
        "model": model,
        "mae": round(float(mae), 3),
        "train_size": int(len(train_df)),
        "test_size": int(len(test_df)),
        "predictions": [round(float(value), 2) for value in predictions],
        "actual_values": [int(value) for value in y_test.tolist()],
    }


def select_model(results: dict[str, dict[str, Any]]) -> str:
    return min(
        results,
        key=lambda model_name: results[model_name]["mae"],
    )


def save_selected_model(
    selected_model_name: str,
    candidate_model_paths: dict[str, Path],
) -> None:
    source_path = candidate_model_paths[selected_model_name]
    shutil.copyfile(source_path, SELECTED_MODEL_PATH)


def build_metrics_results(
    results: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    return {
        model_name: {
            "mae": result["mae"],
            "train_size": result["train_size"],
            "test_size": result["test_size"],
            "actual_values": result["actual_values"],
            "predictions": result["predictions"],
        }
        for model_name, result in results.items()
    }


def save_metrics(
    selected_model_name: str,
    actual_df: pd.DataFrame,
    rule_df: pd.DataFrame,
    actual_train_df: pd.DataFrame,
    actual_test_df: pd.DataFrame,
    results: dict[str, dict[str, Any]],
) -> None:
    metrics = {
        "selected_model": selected_model_name,
        "metric": "MAE",
        "model_type": "RandomForestRegressor",
        "features": FEATURE_COLUMNS,
        "target": TARGET_COLUMN,
        "note": (
            "현재 실제 수집 데이터 수가 적기 때문에 MAE는 최종 성능 검증이 아니라 "
            "학습 파이프라인 동작 확인용 참고 지표로 사용한다."
        ),
        "data": {
            "actual_total_size": int(len(actual_df)),
            "rule_augmented_size": int(len(rule_df)),
            "actual_train_size": int(len(actual_train_df)),
            "actual_test_size": int(len(actual_test_df)),
        },
        "results": build_metrics_results(results),
    }

    with METRICS_PATH.open("w", encoding="utf-8") as file:
        json.dump(metrics, file, ensure_ascii=False, indent=2)


def print_training_summary(
    results: dict[str, dict[str, Any]],
    selected_model_name: str,
) -> None:
    print("Training completed.")

    for model_name, result in results.items():
        print(f"{model_name} MAE: {result['mae']}")

    print(f"Selected model: {selected_model_name}")
    print(f"Selected model saved to: {SELECTED_MODEL_PATH}")
    print(f"Metrics saved to: {METRICS_PATH}")


def main() -> None:
    ensure_output_directories()

    actual_df = load_training_data(RAW_DATA_PATH)
    rule_df = load_training_data(RULE_DATA_PATH)

    actual_train_df, actual_test_df = split_actual_data(actual_df)

    training_datasets = {
        "actual_only": actual_train_df,
        "actual_rule": pd.concat(
            [actual_train_df, rule_df],
            ignore_index=True,
        ),
    }

    results = {
        model_name: train_and_evaluate(
            train_df=train_df,
            test_df=actual_test_df,
            model_path=CANDIDATE_MODEL_PATHS[model_name],
        )
        for model_name, train_df in training_datasets.items()
    }

    selected_model_name = select_model(results)

    save_selected_model(
        selected_model_name=selected_model_name,
        candidate_model_paths=CANDIDATE_MODEL_PATHS,
    )

    save_metrics(
        selected_model_name=selected_model_name,
        actual_df=actual_df,
        rule_df=rule_df,
        actual_train_df=actual_train_df,
        actual_test_df=actual_test_df,
        results=results,
    )

    print_training_summary(
        results=results,
        selected_model_name=selected_model_name,
    )


if __name__ == "__main__":
    main()