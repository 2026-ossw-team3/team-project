from __future__ import annotations

import json
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


BASE_DIR = Path(__file__).resolve().parent

RAW_DATA_PATH = BASE_DIR / "data" / "raw" / "actual_wait_data.csv"
RULE_DATA_PATH = BASE_DIR / "data" / "generated" / "rule_augmented_wait_data.csv"

CANDIDATE_MODEL_DIR = BASE_DIR / "models" / "candidates"
ACTUAL_ONLY_MODEL_PATH = CANDIDATE_MODEL_DIR / "actual_only_model.joblib"
ACTUAL_RULE_MODEL_PATH = CANDIDATE_MODEL_DIR / "actual_rule_model.joblib"
SELECTED_MODEL_PATH = BASE_DIR / "models" / "total_wait_model.joblib"

REPORT_DIR = BASE_DIR / "reports"
METRICS_PATH = REPORT_DIR / "model_metrics.json"

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

FEATURE_COLUMNS = [
    "weekday",
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
    "store_id",
]

TARGET_COLUMN = "total_wait_minutes"

CATEGORICAL_FEATURES = [
    "weekday",
    "store_id",
]

NUMERIC_FEATURES = [
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
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


def ensure_output_directories() -> None:
    CANDIDATE_MODEL_DIR.mkdir(parents=True, exist_ok=True)
    SELECTED_MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)


def validate_required_file(path: Path) -> None:
    if not path.exists():
        raise FileNotFoundError(f"Required data file not found: {path}")


def validate_columns(df: pd.DataFrame, path: Path) -> None:
    missing_columns = [column for column in SOURCE_COLUMNS if column not in df.columns]

    if missing_columns:
        raise ValueError(
            f"{path} is missing required columns: {', '.join(missing_columns)}"
        )


def parse_time_to_minutes(value: str) -> int:
    parsed_time = datetime.strptime(value, "%H:%M").time()

    return parsed_time.hour * 60 + parsed_time.minute


def calculate_wait_minutes(
    current_date: str,
    queue_entered_at: str,
    payment_completed_at: str,
    post_payment_pickup_minutes: int,
) -> int:
    entered_datetime = datetime.strptime(
        f"{current_date} {queue_entered_at}",
        "%Y-%m-%d %H:%M",
    )
    payment_datetime = datetime.strptime(
        f"{current_date} {payment_completed_at}",
        "%Y-%m-%d %H:%M",
    )

    if payment_datetime < entered_datetime:
        payment_datetime += timedelta(days=1)

    kiosk_wait_minutes = int(
        (payment_datetime - entered_datetime).total_seconds() // 60
    )

    return kiosk_wait_minutes + int(post_payment_pickup_minutes)


def is_lunch_time(time_minutes: int) -> int:
    lunch_start_minutes = 12 * 60
    lunch_end_minutes = 13 * 60

    return int(lunch_start_minutes <= time_minutes < lunch_end_minutes)


def add_training_columns(df: pd.DataFrame) -> pd.DataFrame:
    result = df.copy()

    result["date"] = pd.to_datetime(result["date"]).dt.date
    result["weekday"] = result["date"].apply(lambda value: WEEKDAY_LABELS[value.weekday()])
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


def load_training_data(path: Path) -> pd.DataFrame:
    validate_required_file(path)

    df = pd.read_csv(path)
    validate_columns(df, path)

    return add_training_columns(df)


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


def select_model(
    actual_only_result: dict[str, Any],
    actual_rule_result: dict[str, Any],
) -> str:
    if actual_rule_result["mae"] <= actual_only_result["mae"]:
        return "actual_rule"

    return "actual_only"


def save_selected_model(selected_model_name: str) -> None:
    source_path = (
        ACTUAL_RULE_MODEL_PATH
        if selected_model_name == "actual_rule"
        else ACTUAL_ONLY_MODEL_PATH
    )

    shutil.copyfile(source_path, SELECTED_MODEL_PATH)


def save_metrics(
    selected_model_name: str,
    actual_df: pd.DataFrame,
    rule_df: pd.DataFrame,
    actual_train_df: pd.DataFrame,
    actual_test_df: pd.DataFrame,
    actual_only_result: dict[str, Any],
    actual_rule_result: dict[str, Any],
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
        "results": {
            "actual_only": {
                "mae": actual_only_result["mae"],
                "train_size": actual_only_result["train_size"],
                "test_size": actual_only_result["test_size"],
                "actual_values": actual_only_result["actual_values"],
                "predictions": actual_only_result["predictions"],
            },
            "actual_rule": {
                "mae": actual_rule_result["mae"],
                "train_size": actual_rule_result["train_size"],
                "test_size": actual_rule_result["test_size"],
                "actual_values": actual_rule_result["actual_values"],
                "predictions": actual_rule_result["predictions"],
            },
        },
    }

    with METRICS_PATH.open("w", encoding="utf-8") as file:
        json.dump(metrics, file, ensure_ascii=False, indent=2)


def main() -> None:
    ensure_output_directories()

    actual_df = load_training_data(RAW_DATA_PATH)
    rule_df = load_training_data(RULE_DATA_PATH)

    actual_train_df, actual_test_df = split_actual_data(actual_df)

    actual_rule_train_df = pd.concat(
        [actual_train_df, rule_df],
        ignore_index=True,
    )

    actual_only_result = train_and_evaluate(
        train_df=actual_train_df,
        test_df=actual_test_df,
        model_path=ACTUAL_ONLY_MODEL_PATH,
    )

    actual_rule_result = train_and_evaluate(
        train_df=actual_rule_train_df,
        test_df=actual_test_df,
        model_path=ACTUAL_RULE_MODEL_PATH,
    )

    selected_model_name = select_model(
        actual_only_result=actual_only_result,
        actual_rule_result=actual_rule_result,
    )

    save_selected_model(selected_model_name)

    save_metrics(
        selected_model_name=selected_model_name,
        actual_df=actual_df,
        rule_df=rule_df,
        actual_train_df=actual_train_df,
        actual_test_df=actual_test_df,
        actual_only_result=actual_only_result,
        actual_rule_result=actual_rule_result,
    )

    print("Training completed.")
    print(f"Actual only MAE: {actual_only_result['mae']}")
    print(f"Actual + rule MAE: {actual_rule_result['mae']}")
    print(f"Selected model: {selected_model_name}")
    print(f"Selected model saved to: {SELECTED_MODEL_PATH}")
    print(f"Metrics saved to: {METRICS_PATH}")


if __name__ == "__main__":
    main()