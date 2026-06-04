from __future__ import annotations

from datetime import date, datetime, time, timedelta


WEEKDAY_LABELS = {
    0: "MON",
    1: "TUE",
    2: "WED",
    3: "THU",
    4: "FRI",
    5: "SAT",
    6: "SUN",
}

LUNCH_START_MINUTES = 12 * 60
LUNCH_END_MINUTES = 13 * 60


def get_weekday_label(value: date) -> str:
    return WEEKDAY_LABELS[value.weekday()]


def parse_time_to_minutes(value: str) -> int:
    parsed_time = datetime.strptime(value, "%H:%M").time()

    return parsed_time.hour * 60 + parsed_time.minute


def format_minutes_to_time(value: int) -> str:
    normalized_minutes = int(value) % (24 * 60)

    return time(
        hour=normalized_minutes // 60,
        minute=normalized_minutes % 60,
    ).strftime("%H:%M")


def add_minutes_to_time(
    base_date: date,
    base_time_minutes: int,
    minutes: int,
) -> str:
    base_datetime = datetime.combine(
        base_date,
        time(
            hour=(base_time_minutes // 60) % 24,
            minute=base_time_minutes % 60,
        ),
    )
    result_datetime = base_datetime + timedelta(minutes=int(minutes))

    return result_datetime.strftime("%H:%M")


def is_lunch_time(time_minutes: int) -> int:
    return int(LUNCH_START_MINUTES <= time_minutes < LUNCH_END_MINUTES)


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