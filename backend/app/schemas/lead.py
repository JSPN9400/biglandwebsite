import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.lead import LeadSource, LeadStatus


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=20)
    email: EmailStr | None = None
    message: str | None = Field(default=None, max_length=2000)
    source: LeadSource

    @field_validator("phone")
    @classmethod
    def strip_phone(cls, v: str) -> str:
        cleaned = "".join(ch for ch in v if ch.isdigit() or ch == "+")
        if len(cleaned) < 7:
            raise ValueError("phone number too short")
        return cleaned


class LeadOut(BaseModel):
    id: uuid.UUID
    name: str
    phone: str
    email: str | None
    message: str | None
    source: LeadSource
    status: LeadStatus
    created_at: datetime

    model_config = {"from_attributes": True}
