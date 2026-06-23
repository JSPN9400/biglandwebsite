// Shared loader for data.json — used by index.html, estimate.html, admin.html.
// Falls back to sensible defaults if the fetch fails (e.g. opened directly
// as a file:// page instead of through a real web server / GitHub Pages).
async function loadSiteData() {
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('bad response');
    return await res.json();
  } catch (err) {
    console.warn('Could not load data.json (this is expected if you opened this file directly instead of via a web server). Using built-in defaults.', err);
    return {
      packages: [
        { name: 'Essential', pricePerSqft: 1650, featured: false, features: ['Standard fittings', 'RCC structure', '5-year structural warranty', 'Basic electrical & plumbing'] },
        { name: 'Premium', pricePerSqft: 1950, featured: true, features: ['Branded fittings', 'Vitrified tiles', '7-year structural warranty', 'Modular kitchen shell'] },
        { name: 'Luxury', pricePerSqft: 2450, featured: false, features: ['Designer fittings', 'Italian marble options', '10-year structural warranty', 'False ceiling included'] },
        { name: 'Signature', pricePerSqft: null, featured: false, features: ['Bespoke architecture', 'Imported materials', '10-year warranty', 'Dedicated project architect'] },
      ],
      estimator: {
        baseRate: { essential: 1650, premium: 1950, luxury: 2450, signature: 3200 },
        locationMultiplier: { metro: 1.15, tier2: 1.0, tier3: 0.88 },
        materialMultiplier: { standard: 0.92, premium: 1.0, imported: 1.35 },
      },
      team: [
        { name: 'Your Name Here', role: 'Founder & CEO', photo: null },
        { name: 'Your Name Here', role: 'Chief Architect', photo: null },
      ],
      clients: [
        { name: 'Client / Brand One', logo: null },
        { name: 'Client / Brand Two', logo: null },
      ],
    };
  }
}
