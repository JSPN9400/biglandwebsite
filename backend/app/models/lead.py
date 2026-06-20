import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class LeadSource(str, enum.Enum):
    contact_form = "contact_form"
    estimate_form = "estimate_form"
    callback_request = "callback_request"
    site_visit = "site_visit"


class LeadStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    qualified = "qualified"
    converted = "converted"
    lost = "lost"


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(20))
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    source: Mapped[LeadSource] = mapped_column(Enum(LeadSource))
    status: Mapped[LeadStatus] = mapped_column(Enum(LeadStatus), default=LeadStatus.new)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
