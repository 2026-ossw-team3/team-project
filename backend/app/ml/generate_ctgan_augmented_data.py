from __future__ import annotations

import argparse
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from app.ml.ctgan_pipeline.config import (
    SOURCE_MODE_ACTUAL,
    SOURCE_MODE_ACTUAL_RULE,
    SOURCE_MODE_ALL,
)
from app.ml.ctgan_pipeline.generator import main


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate CTGAN-based synthetic wait data."
    )
    parser.add_argument(
        "--source",
        choices=[
            SOURCE_MODE_ACTUAL,
            SOURCE_MODE_ACTUAL_RULE,
            SOURCE_MODE_ALL,
        ],
        default=SOURCE_MODE_ACTUAL_RULE,
        help=(
            "CTGAN source data mode. "
            "'actual' uses actual train data only. "
            "'actual-rule' uses actual train data + rule augmented data. "
            "'all' generates both outputs."
        ),
    )

    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    main(source_mode=args.source)