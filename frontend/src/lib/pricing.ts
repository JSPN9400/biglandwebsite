/**
 * Client-side port of backend/app/core/pricing.py — kept numerically
 * identical so the static (no-backend) demo matches the full-stack version.
 * If you change one, change the other.
 *
 * These are illustrative base rates, not real BigLand Construction pricing —
 * replace BASE_RATE_PER_SQFT and the multipliers below with verified figures
 * before this goes live.
 */
import type { EstimateRequest, EstimateResponse } from '@/lib/api';

const BASE_RATE_PER_SQFT: Record<EstimateRequest['package_type'], number> = {
  essential: 1650,
  premium: 1950,
  luxury: 2450,
  signature: 3200,
};

const LOCATION_MULTIPLIER: Record<EstimateRequest['location_tier'], number> = {
  metro: 1.15,
  tier2: 1.0,
  tier3: 0.88,
};

const MATERIAL_MULTIPLIER: Record<EstimateRequest['material_quality'], number> = {
  standard: 0.92,
  premium: 1.0,
  imported: 1.35,
};

const COST_SPLIT = {
  material_cost: 0.45,
  labour_cost: 0.25,
  finishing_cost: 0.15,
  electrical_cost: 0.08,
  plumbing_cost: 0.07,
} as const;

const GST_RATE = 0.18;
const INTERIOR_ADDON = 0.08;
const EXTERIOR_ADDON = 0.06;
const MULTI_FLOOR_LABOUR_PREMIUM = 0.03; // per additional floor, labour share only

export function calculateEstimateLocally(req: EstimateRequest): EstimateResponse {
  const baseRate = BASE_RATE_PER_SQFT[req.package_type];
  const locationMult = LOCATION_MULTIPLIER[req.location_tier];
  const materialMult = MATERIAL_MULTIPLIER[req.material_quality];

  let subtotal = baseRate * locationMult * materialMult * req.construction_area_sqft;

  if (req.interior) subtotal *= 1 + INTERIOR_ADDON;
  if (req.exterior) subtotal *= 1 + EXTERIOR_ADDON;

  const extraFloors = Math.max(req.floors - 1, 0);
  const labourMultiplier = 1 + MULTI_FLOOR_LABOUR_PREMIUM * extraFloors;

  const buckets: Record<keyof typeof COST_SPLIT, number> = {
    material_cost: 0,
    labour_cost: 0,
    finishing_cost: 0,
    electrical_cost: 0,
    plumbing_cost: 0,
  };

  (Object.keys(COST_SPLIT) as Array<keyof typeof COST_SPLIT>).forEach((key) => {
    let amount = subtotal * COST_SPLIT[key];
    if (key === 'labour_cost') amount *= labourMultiplier;
    buckets[key] = Math.round(amount * 100) / 100;
  });

  const preTaxTotal = Object.values(buckets).reduce((a, b) => a + b, 0);
  const tax = Math.round(preTaxTotal * GST_RATE * 100) / 100;
  const totalCost = Math.round((preTaxTotal + tax) * 100) / 100;
  const costPerSqft = Math.round((totalCost / req.construction_area_sqft) * 100) / 100;

  return {
    ...buckets,
    tax,
    total_cost: totalCost,
    cost_per_sqft: costPerSqft,
  };
}
