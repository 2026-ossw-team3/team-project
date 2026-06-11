from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Store(Base):
    __tablename__ = "stores"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    location = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    average_service_time = Column(Integer, nullable=False, default=3)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    queue_entries = relationship("QueueEntry", back_populates="store")
    queue_events = relationship("QueueEvent", back_populates="store")