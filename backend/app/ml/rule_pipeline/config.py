from __future__ import annotations

from datetime import time
from pathlib import Path


ML_BASE_DIR = Path(__file__).resolve().parents[1]

RAW_DATA_PATH = ML_BASE_DIR / "data" / "raw" / "actual_wait_data.csv"
RULE_DATA_PATH = ML_BASE_DIR / "data" / "generated" / "rule_augmented_wait_data.csv"

RANDOM_SEED = 42

TEAM_PROCESSING_MINUTES = 0.5
BASE_QUEUE_CORRECTION_MINUTES = 1.0

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