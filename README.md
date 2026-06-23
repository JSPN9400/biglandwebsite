# BigLand Construction — Premium Static Website

Plain HTML + CSS + JavaScript. No build step, no Node, no GitHub Actions.
Upload the files to GitHub and it works immediately.

## Pages
| File | Purpose |
|---|---|
| `index.html` | Home page — 6 sections |
| `estimate.html` | Detailed cost estimator with brand selection & PDF |
| `careers.html` | Careers page + Google Form placeholder |
| `admin.html` | Admin panel to edit all content (no backend needed) |

## Sections (in order)
1. **Hero** — animated construction scene (2 cranes, buildings rising, truck)
2. **Free Quote** — package cards linked to estimator
3. **Services We Offer** — 6 service cards with image zoom hover
4. **Why Choose Us** — 4 USPs with tooltip hover effect
5. **Expert Team** — team members (managed via admin panel)
6. **Trusted Brands** — scrolling marquee strip
7. **Working Partners** — partner cards with icons
8. **Trusted Clients** — reverse-scroll marquee strip
9. **Construction Video** — YouTube embed
10. **Contact + Social** — WhatsApp-connected form + social links + footer

## GitHub Pages (simplest method — no GitHub Actions needed)
1. Upload ALL files into the root of your GitHub repo
2. Settings → Pages → Source = **Deploy from a branch** → Branch = main, Folder = / (root) → Save
3. Site live in 1–2 minutes at `https://<username>.github.io/<repo>/`

## Admin Panel
1. Open `admin.html` on your live site (must be served over HTTPS, not opened as local file)
2. Password: `bigland2026` (change in admin.html: `const PASS = '...'`)
3. Edit content → "⬇ Download data.json" → upload to GitHub replacing the old file → done

## Adding your real content
- **Team photos**: upload to `images/team/`, then type path in admin panel
- **Brand logos**: upload to `images/brands/`
- **Client logos**: upload to `images/clients/`
- **Phone/WhatsApp**: set in admin panel → Company Info tab
- **Social links**: admin panel → Company Info
- **Google Form** (careers): open `careers.html`, find the comment block, uncomment the `<iframe>` and paste your form URL
- **Video**: admin panel → Company Info → YouTube embed URL

## Local testing
```bash
python3 -m http.server 8000
# open http://localhost:8000
```
(Opening files directly as file:// won't load data.json due to browser security.)
