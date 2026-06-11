from sqlalchemy.orm import Session

from app.models import Store


DEFAULT_STORES = [
    {
        "name": "광뚝",
        "location": "학생회관 1층",
        "description": "뚝배기 요리가 중심인 코너입니다.",
        "average_service_time": 7,
        "is_active": True,
    },
    {
        "name": "경성카츠",
        "location": "학생회관 1층",
        "description": "일식 요리가 중심인 코너입니다.",
        "average_service_time": 6,
        "is_active": True,
    },
    {
        "name": "바비든든",
        "location": "학생회관 1층",
        "description": "덮밥 요리가 중심인 코너입니다.",
        "average_service_time": 8,
        "is_active": True,
    },
    {
        "name": "비비고고",
        "location": "학생회관 1층",
        "description": "비빔밥 요리가 중심인 코너입니다.",
        "average_service_time": 4,
        "is_active": True,
    },
]


def seed_stores(db: Session) -> None:
    """기본 매장 데이터를 삽입한다.

    이미 같은 이름의 매장/코너가 존재하면 중복 삽입하지 않는다.
    """

    for store_data in DEFAULT_STORES:
        existing_store = (
            db.query(Store)
            .filter(Store.name == store_data["name"])
            .first()
        )

        if existing_store:
            continue

        db.add(Store(**store_data))

    db.commit()