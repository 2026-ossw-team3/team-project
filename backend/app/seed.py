from sqlalchemy.orm import Session

from app.models import Store


DEFAULT_STORES = [
    {
        "name": "학생식당 A",
        "location": "학생회관 1층",
        "description": "점심시간에 이용자가 많은 기본 학식당입니다.",
        "average_service_time": 3,
        "is_active": True,
    },
    {
        "name": "학생식당 B",
        "location": "공학관 지하 1층",
        "description": "공학관 근처 학생들이 주로 이용하는 학식당입니다.",
        "average_service_time": 4,
        "is_active": True,
    },
    {
        "name": "분식 코너",
        "location": "학생회관 1층",
        "description": "간단한 식사와 분식을 제공하는 코너입니다.",
        "average_service_time": 2,
        "is_active": True,
    },
]


def seed_stores(db: Session) -> None:
    """기본 학식당 데이터를 삽입한다.

    이미 같은 이름의 학식당이 존재하면 중복 삽입하지 않는다.
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