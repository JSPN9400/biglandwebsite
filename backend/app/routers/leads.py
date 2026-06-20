from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.limiter import limiter
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadOut

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", response_model=LeadOut, status_code=201)
@limiter.limit("10/minute")
def create_lead(request: Request, payload: LeadCreate, db: Session = Depends(get_db)) -> Lead:
    lead = Lead(**payload.model_dump())
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead
