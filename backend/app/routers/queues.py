import uuid
from datetime import datetime 
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import QueueEntry, QueueEvent
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/queues",
    tags=["Queues"],
)


class QueueCreateRequest(BaseModel):
    store_id: int
    nickname: str     
    party_size: int 

@router.post("")
def issue_ticket(request: QueueCreateRequest, db: Session = Depends(get_db)):
    last_entry = (
        db.query(QueueEntry)
        .filter(QueueEntry.store_id == request.store_id)
        .order_by(QueueEntry.id.desc())
        .first()
    )
    next_number = (last_entry.queue_number + 1) if last_entry else 1

    access_code = str(uuid.uuid4())[:8].upper()

    
    new_entry = QueueEntry(
        store_id=request.store_id,
        nickname=request.nickname,         
        party_size=request.party_size,     
        queue_number=next_number,
        access_code=access_code,
        status="WAITING",
        queue_date=datetime.now()          
    )

    try:
        db.add(new_entry)
        db.flush()

        new_event = QueueEvent(
            queue_entry_id=new_entry.id, 
            store_id=request.store_id,    
            event_type="REGISTERED",     
            to_status="WAITING"              
        )
        db.add(new_event)
        
        db.commit()
        db.refresh(new_entry)

        return {
            "queue_id": new_entry.id,
            "queue_number": new_entry.queue_number,
            "access_code": new_entry.access_code,
            "status": new_entry.status
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="번호표 발급 중 오류가 발생했습니다.")

# Week2 구현 예정
# POST /api/queues
# GET /api/queues/{queue_id}?code={access_code}
# DELETE /api/queues/{queue_id}?code={access_code}
# POST /api/queues/{queue_id}/confirm-arrival?code={access_code}