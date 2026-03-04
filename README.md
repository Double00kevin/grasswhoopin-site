# Grasswhoopin' Lawn Care

Marketing site for **Grasswhoopin' Lawn Care**, serving Ardmore, TN (Tennessee-Alabama border). Southern drill-sergeant brand: lawns are "whooped," services are "punishments," mowing is "submission." Aggressive, loud, comedic.

Built with **Astro 5** + **Tailwind CSS v4**. SSR mode via `@astrojs/cloudflare` adapter — static pages prerendered, admin/API routes server-side. No JS framework integrations (no React/Vue/Svelte). Deployed to **Cloudflare Workers** with **D1** database.

---

## Commands

Run from the project root:

| Command               | Action                                       |
| :-------------------- | :------------------------------------------- |
| `npm run dev`         | Dev server at `localhost:4321`               |
| `npm run build`       | Build production site to `./dist/`           |
| `npm run preview`     | Preview production build locally             |
| `npx astro check`     | TypeScript/Astro type checking               |
| `npx wrangler deploy` | Deploy to Cloudflare Workers                 |

---

## Project Structure

```
/
├── docs/
│   └── CHEATSHEET.md            — Dev quick-reference (workflow, commands, design notes)
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   ├── site.webmanifest
│   ├── robots.txt
│   ├── mascot.png
│   └── mascot.jpg
├── src/
│   ├── components/
│   │   ├── Hero.astro           — full-viewport animated hero (wired into index.astro)
│   │   ├── Services.astro       — services grid (written, not imported — inline in index)
│   │   ├── Testimonials.astro   — testimonials grid (written, not imported — inline in index)
│   │   ├── About.astro          — location section (written, not imported — inline in index)
│   │   ├── Contact.astro        — contact CTA (written, not imported — inline in index)
│   │   └── Footer.astro         — footer (written, not imported — inline in index)
│   ├── layouts/
│   │   └── Layout.astro         — base HTML shell; SEO, OG, JSON-LD, favicon refs; used by admin/login
│   ├── pages/
│   │   ├── index.astro          — homepage (prerendered static; all sections inline)
│   │   ├── login.astro          — admin auth (SSR; cookie-based password login)
│   │   ├── admin.astro          — admin dashboard (SSR; recruits roster, enlist form, cut logger)
│   │   ├── admin/
│   │   │   └── logout.ts        — GET: clears admin cookie, redirects to /login
│   │   └── api/
│   │       ├── customers.ts     — POST: add customer | DELETE: remove customer + cuts
│   │       └── cuts.ts          — POST: log a grass cut for a customer
│   ├── styles/
│   │   └── global.css           — Tailwind v4 import + @theme color tokens
│   └── env.d.ts                 — TypeScript types for CloudflareEnv, D1Database, App.Locals
├── astro.config.mjs
├── wrangler.jsonc               — Cloudflare Workers config; D1 binding, compatibility flags
├── schema.sql                   — D1 database schema (customers, cuts, payments)
├── tsconfig.json
├── check_meta.sh                — Bash script to scan live site OG/SEO meta tags
└── package.json
```

---

## Design System

### Color Tokens

Defined in `src/styles/global.css` via `@theme {}` (Tailwind v4 syntax — no `tailwind.config.*` file).

| Token       | Hex       | Usage                              |
| :---------- | :-------- | :--------------------------------- |
| `army`      | `#0F2C23` | Deep dark green — main background  |
| `olive`     | `#1E3F2F` | Section backgrounds                |
| `camo`      | `#4b5320` | Borders, accents                   |
| `deere`     | `#FACC15` | John Deere yellow — headings, CTAs |
| `screaming` | `#4ADE80` | Neon green — highlights, names     |
| `rust`      | `#F97316` | Orange — accents                   |
| `dirt`      | `#78350f` | Brown — card backgrounds           |

Available as Tailwind utilities: `bg-army`, `text-deere`, `border-camo`, `text-screaming`, etc.

### Fonts

- **Barlow** (400) — body text
- **Barlow Condensed** (400, 700, 800, 900) — headings, hero text
- Loaded via Google Fonts with `preconnect` in `Hero.astro`

---

## Current Homepage Sections

All sections are currently implemented inline in `src/pages/index.astro`. The standalone components in `src/components/` exist as reference/templates but are not imported.

1. **Hero** — Full-viewport animated stacked text (`DOES YOUR YARD NEED A GRASSWHOOPIN'?`), mascot PNG, SMS CTA button (`sms:2569290532`)
2. **What We Do** — 4 services: Weekly Mowing, Edging & Trimming, Weed Control, Full Yard Overhaul
3. **Neighbors Say** — 4 inline testimonials
4. **Where We're Located** — Service area description (Ardmore, TN/AL border)
5. **Contact** — Phone `tel:` link with yellow glow effect
6. **Footer** — Copyright

---

## Deployment

Deployed to **Cloudflare Workers** via `wrangler.jsonc`.

- **Worker name:** `grasswhoopin-site`
- **D1 binding:** `grasswhoopin_db` → database `grasswhoopin-db`
- **Compatibility flags:** `nodejs_compat`, `global_fetch_strictly_public`
- **Required production secret:** `ADMIN_PASSWORD` — set via `npx wrangler secret put ADMIN_PASSWORD`
- **Local dev vars:** stored in `.dev.vars` (not tracked by git)

---

## Admin System

Password-protected crew management panel. All admin routes require a valid `gw_admin` session cookie.

| Route              | Method | Description                                          |
| :----------------- | :----- | :--------------------------------------------------- |
| `/login`           | GET/POST | Login form; validates `ADMIN_PASSWORD`, sets cookie |
| `/admin`           | GET    | Dashboard: recruit roster, enlist form, cut logger   |
| `/admin/logout`    | GET    | Clears cookie, redirects to `/login`                 |
| `/api/customers`   | POST   | Add new customer (name, address, phone, frequency)   |
| `/api/customers`   | DELETE | Remove customer + all associated cuts (`?id=X`)      |
| `/api/cuts`        | POST   | Log a grass cut for a customer                       |

**Cookie:** `gw_admin=authorized` — httpOnly, secure, sameSite strict, 7-day maxAge

**Flash messages** via URL params: `?added=1` (new recruit), `?whooped=1` (cut logged), `?error=1`

---

## Database Schema

D1 SQLite database. Schema source: `schema.sql`.

### `customers`
| Column      | Type    | Notes                        |
| :---------- | :------ | :--------------------------- |
| id          | INTEGER | PK autoincrement             |
| name        | TEXT    | Required                     |
| address     | TEXT    | Required                     |
| phone       | TEXT    |                              |
| frequency   | TEXT    | Default: `'weekly'`          |
| notes       | TEXT    |                              |
| active      | INTEGER | Default: `1` (soft delete)   |
| created_at  | TEXT    | `datetime('now')`            |

### `cuts`
| Column      | Type    | Notes                        |
| :---------- | :------ | :--------------------------- |
| id          | INTEGER | PK autoincrement             |
| customer_id | INTEGER | FK → customers.id            |
| cut_date    | TEXT    | Default: `date('now')`       |
| notes       | TEXT    |                              |
| created_at  | TEXT    | `datetime('now')`            |

### `payments`
| Column      | Type    | Notes                        |
| :---------- | :------ | :--------------------------- |
| id          | INTEGER | PK autoincrement             |
| customer_id | INTEGER | FK → customers.id            |
| amount      | REAL    | Required                     |
| paid_date   | TEXT    | Default: `date('now')`       |
| notes       | TEXT    |                              |
| created_at  | TEXT    | `datetime('now')`            |

---

## Brand Voice

All copy follows the Southern drill-sergeant bit. Maintain this voice for any new copy or components: lawns are "whooped," services are "punishments," customers are "recruits." Keep it loud, Southern, and absurd.
