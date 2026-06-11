from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base
from app.utils.datetime import now_kst


class QueueEvent(Base):
    __tablename__ = "queue_events"

    id = Column(Integer, primary_key=True, index=True)
    queue_entry_id = Column(Integer, ForeignKey("queue_entries.id"), nullable=False, index=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False, index=True)

    event_type = Column(String(30), nullable=False, index=True)
    from_status = Column(String(20), nullable=True)
    to_status = Column(String(20), nullable=False)

    created_at = Column(DateTime(timezone=True), default=now_kst, nullable=False)
    memo = Column(Text, nullable=True)

    queue_entry = relationship("QueueEntry", back_populates="events")
    store = relationship("Store", back_populates="queue_events")