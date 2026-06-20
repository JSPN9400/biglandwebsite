from enum import Enum

from pydantic import BaseModel, Field


class PackageType(str, Enum):
    essential = "essential"
    premium = "premium"
    luxury = "luxury"
    signature = "signature"


class LocationTier(str, Enum):
    metro = "metro"
    tier2 = "tier2"
    tier3 = "tier3"


class MaterialQuality(str, Enum):
    standard = "standard"
    premium = "premium"
    imported = "imported"


class EstimateRequest(BaseModel):
    plot_size_sqft: float = Field(gt=0, le=100000)
    construction_area_sqft: float = Field(gt=0, le=200000)
    floors: int = Field(ge=1, le=10)
    package_type: PackageType
    location_tier: LocationTier
    material_quality: MaterialQuality
    interior: bool = True
    exterior: bool = True


class EstimateResponse(BaseModel):
    material_cost: float
    labour_cost: float
    finishing_cost: float
    electrical_cost: float
    plumbing_cost: float
    tax: float
    total_cost: float
    cost_per_sqft: float
