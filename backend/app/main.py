from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import Base, engine
from app.core.limiter import limiter
from app.routers import estimate, leads

# Creates tables if they don't exist yet. For anything beyond local/dev use,
# switch to Alembic migrations (scaffold included in /alembic) instead of
# relying on create_all.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BigLand Construction API",
    version="0.1.0",
    description="Lead capture and cost-estimation API for the BigLand Construction site.",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(leads.router, prefix="/api")
app.include_router(estimate.router, prefix="/api")


@app.get("/api/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.environment}
