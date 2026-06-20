const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: 'contact_form' | 'estimate_form' | 'callback_request' | 'site_visit';
}

export async function submitLead(payload: LeadPayload) {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || 'Failed to submit lead');
  }
  return res.json();
}

export interface EstimateRequest {
  plot_size_sqft: number;
  construction_area_sqft: number;
  floors: number;
  package_type: 'essential' | 'premium' | 'luxury' | 'signature';
  location_tier: 'metro' | 'tier2' | 'tier3';
  material_quality: 'standard' | 'premium' | 'imported';
  interior: boolean;
  exterior: boolean;
}

export interface EstimateResponse {
  material_cost: number;
  labour_cost: number;
  finishing_cost: number;
  electrical_cost: number;
  plumbing_cost: number;
  tax: number;
  total_cost: number;
  cost_per_sqft: number;
}

export async function getEstimate(payload: EstimateRequest): Promise<EstimateResponse> {
  const res = await fetch(`${API_BASE}/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || 'Failed to calculate estimate');
  }
  return res.json();
}
