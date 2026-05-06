from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.models import QueueEntry, QueueEvent, Store  # noqa: F401
from app.routers import admin, health, queues, stats, stores
from app.seed import seed_stores


app = FastAPI(
    title="Virtual Queue API",
    description="학식당 대기 문제 해결을 위한 웹 기반 가상 대기열 관리 API",
    version="0.1.0",
)


# Week1 MVP에서는 Alembic 대신 앱 시작 시 테이블을 생성한다.
# 추후 PostgreSQL 전환 또는 운영 환경에서는 migration 도구 도입을 고려한다.
Base.metadata.create_all(bind=engine)


def initialize_seed_data() -> None:
    """개발용 기본 데이터를 초기화한다."""

    db = SessionLocal()

    try:
        seed_stores(db)
    finally:
        db.close()


initialize_seed_data()


# Frontend 개발 서버 접근 허용
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(health.router)
app.include_router(stores.router)
app.include_router(queues.router)
app.include_router(admin.router)
app.include_router(stats.router)