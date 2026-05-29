from __future__ import annotations

import random
from datetime import date
from typing import Any

import numpy as np
import pandas as pd
from ctgan import CTGAN

from app.ml.common.time_features import (
    calculate_wait_minutes,
    format_minutes_to_time,
    parse_time_to_minutes,
)
from app.ml.common.wait_data import (
    SOURCE_COLUMNS,
    TARGET_COLUMN,
    add_training_columns,
    load_wait_data,
    split_actual_data,
)
from app.ml.ctgan_pipeline.config import (
    CTGAN_COLUMNS,
    CTGAN_EPOCHS,
    CTGAN_OUTPUT_PATHS,
    CTGAN_SAMPLE_SIZE,
    DISCRETE_COLUMNS,
    RANDOM_STATE,
    RAW_DATA_PATH,
    RULE_DATA_PATH,
    SOURCE_MODE_ACTUAL,
    SOURCE_MODE_ACTUAL_RULE,
    SOURCE_MODE_ALL,
    SUPPORTED_SOURCE_MODES,
)
from app.ml.ctgan_pipeline.context import (
    build_sanitize_context,
    build_weekday_date_candidates,
)
from app.ml.ctgan_pipeline.sanitizer import sanitize_synthetic_row


def ensure_output_directory(output_path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)


def set_random_seeds() -> None:
    random.seed(RANDOM_STATE)
    np.random.seed(RANDOM_STATE)

    try:
        import torch

        torch.manual_seed(RANDOM_STATE)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(RANDOM_STATE)
    except ImportError:
        pass


def validate_source_mode(source_mode: str) -> None:
    if source_mode not in SUPPORTED_SOURCE_MODES:
        raise ValueError(
            f"Unsupported source mode: {source_mode}. "
            f"Supported modes: {', '.join(sorted(SUPPORTED_SOURCE_MODES))}"
        )


def build_ctgan_source_frame(source_mode: str) -> tuple[
    pd.DataFrame,
    pd.DataFrame,
    pd.DataFrame,
    dict[str, list[date]],
]:
    actual_df = add_training_columns(load_wait_data(RAW_DATA_PATH))
    actual_train_df, actual_test_df = split_actual_data(actual_df)

    if source_mode == SOURCE_MODE_ACTUAL:
        ctgan_source_df = actual_train_df.copy()
        weekday_date_candidates = build_weekday_date_candidates(actual_train_df)

    elif source_mode == SOURCE_MODE_ACTUAL_RULE:
        rule_df = add_training_columns(load_wait_data(RULE_DATA_PATH))

        ctgan_source_df = pd.concat(
            [actual_train_df, rule_df],
            ignore_index=True,
        )
        weekday_date_candidates = build_weekday_date_candidates(
            actual_train_df,
            rule_df,
        )

    else:
        raise ValueError(f"Invalid CTGAN source mode for single run: {source_mode}")

    ctgan_source_df = ctgan_source_df[CTGAN_COLUMNS].copy()

    ctgan_source_df["weekday"] = ctgan_source_df["weekday"].astype(str)
    ctgan_source_df["is_lunch_time"] = ctgan_source_df["is_lunch_time"].astype(int)
    ctgan_source_df["store_id"] = ctgan_source_df["store_id"].astype(str)

    continuous_columns = [
        column for column in CTGAN_COLUMNS if column not in DISCRETE_COLUMNS
    ]

    for column in continuous_columns:
        ctgan_source_df[column] = ctgan_source_df[column].astype(float)

    if ctgan_source_df.isnull().any().any():
        raise ValueError("CTGAN source data must not contain missing values.")

    return ctgan_source_df, actual_train_df, actual_test_df, weekday_date_candidates


def generate_ctgan_data(
    source_df: pd.DataFrame,
    weekday_date_candidates: dict[str, list[date]],
    sanitize_context: dict[str, Any],
) -> pd.DataFrame:
    ctgan = CTGAN(
        epochs=CTGAN_EPOCHS,
        verbose=True,
    )

    ctgan.fit(source_df, DISCRETE_COLUMNS)

    synthetic_df = ctgan.sample(CTGAN_SAMPLE_SIZE)

    sanitized_rows = [
        sanitize_synthetic_row(
            row=row,
            row_index=index,
            weekday_date_candidates=weekday_date_candidates,
            sanitize_context=sanitize_context,
        )
        for index, row in synthetic_df.iterrows()
    ]

    return pd.DataFrame(sanitized_rows, columns=SOURCE_COLUMNS)


def save_ctgan_data(ctgan_df: pd.DataFrame, output_path) -> None:
    ctgan_df.to_csv(
        output_path,
        index=False,
        encoding="utf-8",
    )


def calculate_generated_total_wait_minutes(row: pd.Series) -> int:
    return calculate_wait_minutes(
        current_date=row["date"],
        queue_entered_at=row["queue_entered_at"],
        payment_completed_at=row["payment_completed_at"],
        post_payment_pickup_minutes=row["post_payment_pickup_minutes"],
    )


def print_generation_summary(
    ctgan_df: pd.DataFrame,
    sanitize_context: dict[str, Any],
) -> None:
    summary_df = ctgan_df.copy()
    summary_df["time_minutes"] = summary_df["queue_entered_at"].apply(
        parse_time_to_minutes
    )
    summary_df[TARGET_COLUMN] = summary_df.apply(
        calculate_generated_total_wait_minutes,
        axis=1,
    )
    summary_df["kiosk_wait_minutes"] = (
        summary_df[TARGET_COLUMN]
        - summary_df["post_payment_pickup_minutes"]
    )

    print("Generated data summary:")
    print(
        "- Source time range: "
        f"{format_minutes_to_time(sanitize_context['min_time_minutes'])} ~ "
        f"{format_minutes_to_time(sanitize_context['max_time_minutes'])}"
    )
    print(
        "- Generated time range: "
        f"{summary_df['queue_entered_at'].min()} ~ "
        f"{summary_df['queue_entered_at'].max()}"
    )
    print(
        "- Queue ahead range: "
        f"{summary_df['queue_ahead_team_count'].min()} ~ "
        f"{summary_df['queue_ahead_team_count'].max()}"
    )
    print(
        "- Pickup range: "
        f"{summary_df['post_payment_pickup_minutes'].min()} ~ "
        f"{summary_df['post_payment_pickup_minutes'].max()}"
    )
    print(
        "- Total wait range: "
        f"{summary_df[TARGET_COLUMN].min()} ~ "
        f"{summary_df[TARGET_COLUMN].max()}"
    )
    print(f"- Min kiosk wait minutes: {summary_df['kiosk_wait_minutes'].min()}")
    print(f"- Duplicated rows: {summary_df.duplicated(subset=SOURCE_COLUMNS).sum()}")


def run_single_source_mode(source_mode: str) -> None:
    output_path = CTGAN_OUTPUT_PATHS[source_mode]

    set_random_seeds()
    ensure_output_directory(output_path)

    (
        source_df,
        actual_train_df,
        actual_test_df,
        weekday_date_candidates,
    ) = build_ctgan_source_frame(source_mode)

    sanitize_context = build_sanitize_context(source_df)

    ctgan_df = generate_ctgan_data(
        source_df=source_df,
        weekday_date_candidates=weekday_date_candidates,
        sanitize_context=sanitize_context,
    )
    save_ctgan_data(
        ctgan_df=ctgan_df,
        output_path=output_path,
    )

    print("CTGAN augmented data generation completed.")
    print(f"Source mode: {source_mode}")
    print(f"Source rows for CTGAN: {len(source_df)}")
    print(f"Actual train rows used: {len(actual_train_df)}")
    print(f"Actual test rows excluded: {len(actual_test_df)}")
    print(f"Generated CTGAN rows: {len(ctgan_df)}")
    print(f"Saved to: {output_path}")
    print("Weekday date candidates:")
    for weekday, candidates in weekday_date_candidates.items():
        print(f"- {weekday}: {len(candidates)} dates")

    print_generation_summary(
        ctgan_df=ctgan_df,
        sanitize_context=sanitize_context,
    )


def main(source_mode: str = SOURCE_MODE_ACTUAL_RULE) -> None:
    validate_source_mode(source_mode)

    if source_mode == SOURCE_MODE_ALL:
        for single_mode in [SOURCE_MODE_ACTUAL, SOURCE_MODE_ACTUAL_RULE]:
            run_single_source_mode(single_mode)
            print()
        return

    run_single_source_mode(source_mode)