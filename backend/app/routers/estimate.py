from fastapi import APIRouter, Request

from app.core.limiter import limiter
from app.core.pricing import calculate_estimate
from app.schemas.estimate import EstimateRequest, EstimateResponse

router = APIRouter(prefix="/estimate", tags=["estimate"])


@router.post("", response_model=EstimateResponse)
@limiter.limit("30/minute")
def estimate(request: Request, payload: EstimateRequest) -> EstimateResponse:
    return calculate_estimate(payload)
