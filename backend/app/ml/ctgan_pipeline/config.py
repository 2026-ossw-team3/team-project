from __future__ import annotations

from pathlib import Path


ML_BASE_DIR = Path(__file__).resolve().parents[1]

RAW_DATA_PATH = ML_BASE_DIR / "data" / "raw" / "actual_wait_data.csv"
RULE_DATA_PATH = ML_BASE_DIR / "data" / "generated" / "rule_augmented_wait_data.csv"

CTGAN_ACTUAL_DATA_PATH = (
    ML_BASE_DIR / "data" / "generated" / "ctgan_actual_augmented_wait_data.csv"
)
CTGAN_ACTUAL_RULE_DATA_PATH = (
    ML_BASE_DIR / "data" / "generated" / "ctgan_actual_rule_augmented_wait_data.csv"
)

SOURCE_MODE_ACTUAL = "actual"
SOURCE_MODE_ACTUAL_RULE = "actual-rule"
SOURCE_MODE_ALL = "all"

SUPPORTED_SOURCE_MODES = {
    SOURCE_MODE_ACTUAL,
    SOURCE_MODE_ACTUAL_RULE,
    SOURCE_MODE_ALL,
}

CTGAN_OUTPUT_PATHS = {
    SOURCE_MODE_ACTUAL: CTGAN_ACTUAL_DATA_PATH,
    SOURCE_MODE_ACTUAL_RULE: CTGAN_ACTUAL_RULE_DATA_PATH,
}

RANDOM_STATE = 42
CTGAN_EPOCHS = 100
CTGAN_SAMPLE_SIZE = 200

CTGAN_COLUMNS = [
    "weekday",
    "time_minutes",
    "is_lunch_time",
    "queue_ahead_team_count",
    "store_id",
    "post_payment_pickup_minutes",
    "total_wait_minutes",
]

DISCRETE_COLUMNS = [
    "weekday",
    "is_lunch_time",
    "store_id",
]

STORE_NAMES = {
    1: "광뚝",
    2: "경성카츠",
    3: "바비든든",
    4: "비비고고",
}

MIN_PICKUP_MINUTES = 2
MAX_PICKUP_MINUTES = 20

MIN_TOTAL_WAIT_MINUTES = 2
MAX_TOTAL_WAIT_MINUTES = 120

MIN_QUEUE_AHEAD_TEAM_COUNT = 0
MAX_QUEUE_AHEAD_TEAM_COUNT = 45