# BigLand Construction — Full-Stack Rebuild

Implements Phases 1, 2, 3 (lightweight path), and 4 of the improvement roadmap, on top of the original
site's exact gold/cream theme (colors, spacing, type all carried over as Tailwind tokens — nothing
redesigned).

## What's real and working here

- **Static demo mode (current default)** — the cost estimator calculates entirely in the browser
  (`frontend/src/lib/pricing.ts`, numerically identical to the backend version), and both the contact
  form and the estimator's callback button hand off to WhatsApp with a pre-filled message. No backend
  needs to be running for any of this to work — safe to deploy straight to GitHub Pages.
- **Backend still included and ready** (`backend/`) for when you want real lead storage in Postgres
  instead of WhatsApp handoff — see "Switching to the real backend" below.
- **SEO basics** — meta description, canonical, Open Graph/Twitter cards, GeneralContractor JSON-LD schema,
  robots.txt, sitemap.xml — all in `frontend/index.html` and `frontend/public/`.
- **Backend** — FastAPI with Pydantic validation on every input, rate limiting (slowapi) on both endpoints,
  SQLAlchemy models, CORS locked to known origins.
- **Docker Compose** — Postgres + FastAPI + Nginx-served frontend, wired together and ready to run.

## What's intentionally a placeholder — please check before going live

- **Pricing numbers** are illustrative (`backend/app/core/pricing.py` and the package cards in
  `Packages.tsx`). Replace `BASE_RATE_PER_SQFT` and the package prices with verified figures from
  estimation/finance.
- **Phone number / WhatsApp number** (`+91 7505 205 205`) was carried over from the original file — confirm
  it's correct before deploying.
- **Domain** (`biglandconstruction.com`) used in meta tags/schema/sitemap is a placeholder — swap for the
  real domain.
- The estimator's "Save & Request a Callback" button uses a plain `window.prompt()` for the phone number —
  functional, but a proper modal would be a better experience; flagged here rather than silently shipped.
- Sections from the original file not yet ported: team grid, client logos, video showcase carousel,
  banking-partners marquee. These were static/decorative rather than conversion-critical, so they were
  deprioritized — say the word and I'll port them next.

## GitHub Pages par dikhane ke liye (static demo, bina backend ke)

Ab estimator browser mein hi calculate hota hai aur contact/estimate forms WhatsApp khol dete hain —
isliye backend chalaye bina bhi pura frontend kaam karega.

**Sabse aasan tareeka — GitHub Actions (automatic):**

1. Is poore `bigland` folder ko apne GitHub repo mein push karo (root mein hi — `.github/workflows/deploy.yml`
   bhi saath jaana chahiye).
2. GitHub repo → **Settings → Pages** → "Build and deployment" mein **Source = GitHub Actions** select karo.
3. `main` branch par push karte hi workflow apne aap chalega: `frontend` ko build karega aur Pages par
   deploy kar dega. Kuch minute mein `https://<aapka-username>.github.io/<repo-name>/` par site dikhegi.
4. Agar pehli baar push karne ke baad bhi blank dikhe, to repo ke **Actions** tab mein jaakar dekho ki
   workflow run hua ya nahi, aur agar laal (failed) hai to error message mujhe bhejo.

**Manual tareeka (agar Actions use nahi karna):**

```bash
cd frontend
npm install
BASE_PATH="/<aapka-repo-name>/" npm run build
```

Isse `frontend/dist` folder banega — uske andar ki saari files ko `gh-pages` branch mein push karo (ya
GitHub Pages settings mein `dist` folder ko source set karo).

> **Zaroori:** `<aapka-repo-name>` ko apne asli GitHub repo ke naam se replace karna — agar repo ka naam
> `bigland-construction` hai, to `BASE_PATH="/bigland-construction/"`.

---

## Switching to the real backend later

Right now `Contact.tsx` and the estimator's callback button send data to WhatsApp instead of the
database, so the site works on static hosting. When you're ready to host the FastAPI backend somewhere
(Render, Railway, your own server):

1. Deploy `backend/` (see Docker Compose below) and note its public URL.
2. In `Contact.tsx`, replace the `window.open('https://wa.me/...')` call in `onSubmit` with
   `await submitLead({ ...values, source: 'contact_form' })` (import from `@/lib/api` — it's already
   written and untouched, just not wired in yet).
3. In `EstimatorPage.tsx`, swap the local `calculateEstimateLocally` call in the `mutationFn` for
   `getEstimate(payload)` from `@/lib/api` to use the server-side calculation instead.
4. Set `VITE_API_BASE_URL` to your backend's public URL in the frontend's `.env`.

## Running it locally with the backend (Docker)

```bash
cp backend/.env.example backend/.env
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:8000/api/health
- Postgres: localhost:5432 (user/pass/db: `bigland`/`bigland`/`bigland`)

For frontend-only development with hot reload (against the dockerized backend):

```bash
cd frontend
npm install
npm run dev
```

Vite's dev server proxies `/api` to `http://localhost:8000` automatically (see `vite.config.ts`).

> **Note on this environment:** I wrote and reviewed every file here, but I don't have network access in
> this chat to run `npm install` or `docker compose up` myself, so I can't show you a live screenshot or
> confirm a clean install end-to-end. Please run the commands above and let me know if anything breaks —
> I'll fix it from the error output.

## Migrations

A bare `Base.metadata.create_all()` runs on backend startup for convenience in development. For anything
beyond local use, set up Alembic:

```bash
cd backend
pip install -r requirements.txt
alembic init alembic   # if you want versioned migrations instead of create_all
```

## Next phases (not started)

- **Phase 6** — move team/testimonial/gallery content out of hardcoded arrays into the database.
- **Phase 7** — CRM/admin dashboard (auth, role-based access, lead/project/client management, analytics),
  Three.js building viewer. This is the heaviest remaining piece — worth starting once Phases 1–4 are
  live and there's real lead data flowing in.
