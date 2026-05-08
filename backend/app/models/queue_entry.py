from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    queue_date = Column(Date, nullable=False, index=True)
    queue_number = Column(Integer, nullable=False)

    nickname = Column(String(50), nullable=False)
    party_size = Column(Integer, nullable=False, default=1)

    access_code = Column(String(20), nullable=False, index=True)
    status = Column(String(20), nullable=False, default="WAITING", index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    called_at = Column(DateTime(timezone=True), nullable=True)
    arrived_at = Column(DateTime(timezone=True), nullable=True)
    served_at = Column(DateTime(timezone=True), nullable=True)
    canceled_at = Column(DateTime(timezone=True), nullable=True)
    no_show_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    store = relationship("Store", back_populates="queue_entries")
    events = relationship("QueueEvent", back_populates="queue_entry", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint(
            "store_id",
            "queue_date",
            "queue_number",
            name="uq_store_date_queue_number",
        ),
    )