"""Construction cost estimation logic.

These are illustrative base rates, not real BigLand Construction pricing —
replace BASE_RATE_PER_SQFT and the multipliers below with verified figures
from estimation/finance before this goes live. Keeping the logic in one
place (rather than duplicated in the frontend) means it can later be
exposed as editable settings in the CRM admin panel without touching the
client.
"""

from app.schemas.estimate import EstimateRequest, EstimateResponse, LocationTier, MaterialQuality, PackageType

BASE_RATE_PER_SQFT: dict[PackageType, float] = {
    PackageType.essential: 1650,
    PackageType.premium: 1950,
    PackageType.luxury: 2450,
    PackageType.signature: 3200,
}

LOCATION_MULTIPLIER: dict[LocationTier, float] = {
    LocationTier.metro: 1.15,
    LocationTier.tier2: 1.0,
    LocationTier.tier3: 0.88,
}

MATERIAL_MULTIPLIER: dict[MaterialQuality, float] = {
    MaterialQuality.standard: 0.92,
    MaterialQuality.premium: 1.0,
    MaterialQuality.imported: 1.35,
}

# Share of the pre-tax subtotal attributed to each cost bucket.
COST_SPLIT = {
    "material_cost": 0.45,
    "labour_cost": 0.25,
    "finishing_cost": 0.15,
    "electrical_cost": 0.08,
    "plumbing_cost": 0.07,
}

GST_RATE = 0.18
INTERIOR_ADDON = 0.08
EXTERIOR_ADDON = 0.06
MULTI_FLOOR_LABOUR_PREMIUM = 0.03  # per additional floor, applied to labour share only


def calculate_estimate(req: EstimateRequest) -> EstimateResponse:
    base_rate = BASE_RATE_PER_SQFT[req.package_type]
    location_mult = LOCATION_MULTIPLIER[req.location_tier]
    material_mult = MATERIAL_MULTIPLIER[req.material_quality]

    effective_rate = base_rate * location_mult * material_mult
    subtotal = effective_rate * req.construction_area_sqft

    if req.interior:
        subtotal *= 1 + INTERIOR_ADDON
    if req.exterior:
        subtotal *= 1 + EXTERIOR_ADDON

    extra_floors = max(req.floors - 1, 0)
    labour_multiplier = 1 + (MULTI_FLOOR_LABOUR_PREMIUM * extra_floors)

    buckets: dict[str, float] = {}
    for key, share in COST_SPLIT.items():
        amount = subtotal * share
        if key == "labour_cost":
            amount *= labour_multiplier
        buckets[key] = round(amount, 2)

    pre_tax_total = sum(buckets.values())
    tax = round(pre_tax_total * GST_RATE, 2)
    total_cost = round(pre_tax_total + tax, 2)
    cost_per_sqft = round(total_cost / req.construction_area_sqft, 2)

    return EstimateResponse(
        material_cost=buckets["material_cost"],
        labour_cost=buckets["labour_cost"],
        finishing_cost=buckets["finishing_cost"],
        electrical_cost=buckets["electrical_cost"],
        plumbing_cost=buckets["plumbing_cost"],
        tax=tax,
        total_cost=total_cost,
        cost_per_sqft=cost_per_sqft,
    )
