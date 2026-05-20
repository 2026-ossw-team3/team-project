from datetime import date, datetime
from zoneinfo import ZoneInfo


KST = ZoneInfo("Asia/Seoul")


def now_kst() -> datetime:
    """Return the current datetime based on Korea Standard Time.

    MVP 개발 환경에서는 서버 기준 시간대를 KST로 통일해 사용한다.
    SQLite에는 timezone 정보가 완전하게 보존되지 않을 수 있으므로,
    DB 저장값은 KST 기준 naive datetime으로 통일한다.
    """

    return datetime.now(KST).replace(tzinfo=None)


def today_kst() -> date:
    """Return the current date based on Korea Standard Time."""

    return now_kst().date()