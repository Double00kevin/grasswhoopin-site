# GrassWhoopin Site — AI Context

> This file is the single source of truth for AI assistants working on this project.
> It works as Claude Code session context AND as a paste-in for any external AI conversation.
> Last updated: 2026-03-11

---

## Project Identity

Lawn-care operations dashboard and admin system. Private internal tool for one operator.

Brand voice: lawns are "whooped," customers are "recruits." Southern, loud, military-coded.

Repo path: `~/projects/grasswhoopin-site`

---

## Stack & Standards

| | |
|---|---|
| Framework | Astro v5, `output: 'server'` (SSR default) |
| Styling | Tailwind CSS v4 — `@import "tailwindcss"` in CSS files; config via `@tailwindcss/vite` in `astro.config.mjs` |
| Deployment | Cloudflare Pages (auto-deploy on push to `main`) |
| Database | Cloudflare D1, binding name: `grasswhoopin_db` |
| Package manager | npm (never Yarn/Bun) |
| Runtime | Cloudflare Workers (via `@astrojs/cloudflare` adapter) |

---

## Common Commands

```sh
npm run dev                   # dev server at http://localhost:4321
npm run build                 # verify zero build errors before pushing
npx wrangler pages deploy dist  # manual deploy (auto-deploy preferred)

# Local DB setup (run once after clearing .wrangler/state/)
npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql

# Remote DB migration
npx wrangler d1 execute grasswhoopin-db --remote --file=migrations/<file>.sql
```

## Deployment Workflow

```sh
npm run build           # must complete with zero errors
git add <files>
git commit -m "message"
git push                # Cloudflare Pages auto-builds and deploys (~1-2 min)
```

---

## Current DB Schema (4 tables — defined in `schema.sql`)

### customers (billing/contact only)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| name | TEXT NOT NULL | |
| phone | TEXT | nullable |
| notes | TEXT | nullable |
| active | INTEGER | 1 = active, 0 = discharged |
| created_at | TEXT | datetime('now') |

### yards (one per property, many per customer)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| customer_id | INTEGER NOT NULL | FK → customers.id |
| label | TEXT | e.g. "Home", "Rental on Pulaski" — nullable |
| address | TEXT NOT NULL | |
| frequency | TEXT | weekly / bi-weekly / monthly / one-time |
| quoted_price | REAL | nullable |
| active | INTEGER | 1 = active, 0 = removed |
| created_at | TEXT | datetime('now') |

### cuts (lawn cut log — per yard)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| yard_id | INTEGER NOT NULL | FK → yards.id |
| cut_date | TEXT NOT NULL | date('now') default |
| price | REAL | nullable |
| notes | TEXT | nullable |
| created_at | TEXT | datetime('now') |

### payments (at customer level — covers all yards)
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| customer_id | INTEGER NOT NULL | FK → customers.id |
| amount | REAL NOT NULL | |
| paid_date | TEXT NOT NULL | date('now') default |
| notes | TEXT | nullable |
| created_at | TEXT | datetime('now') |

> **Production note:** `customers_backup` table also exists in production D1 (from 2026-03-11 migration). Drop it manually after confirming data integrity: `npx wrangler d1 execute grasswhoopin-db --remote --command "DROP TABLE customers_backup;"`

### Cloudflare Runtime Access
```ts
// In .astro pages:
const db = Astro.locals.runtime.env.grasswhoopin_db;
// In API routes (.ts):
const db = locals.runtime.env.grasswhoopin_db;
```

---

## Component Architecture

```
src/layouts/
  AdminLayout.astro       — DO NOT TOUCH: page shell, header, sticky nav

src/components/
  AdminStats.astro        — metric cards (totalCustomers, cutsMonth, revenueMonth, revenueAll, totalOwed)
  CustomerRoster.astro    — accepts customerGroups: CustomerGroup[]; renders nested customer+yard cards

src/pages/
  admin.astro             — controller: auth, DB queries, TypeScript grouping, flash params, composition
                            Passes customerGroups to CustomerRoster (NOT customers[])
                            Contains two modals: #edit-customer-modal and #edit-yard-modal
                            All JS event handlers (querySelectorAll) live here — not in components

src/pages/api/
  enlist.ts     — POST: create customer + first yard atomically → redirect /admin?added=1
  customers.ts  — PUT: edit name/phone/notes | DELETE: discharge | PATCH: reinstate
  yards.ts      — POST: add yard | PUT: edit | DELETE: discharge | PATCH: reinstate
  cuts.ts       — POST: log a cut by yard_id → redirect /admin?whooped=1
  payments.ts   — POST: record manual payment by customer_id (NO card processing ever)
```

### data-* Cross-Boundary Pattern
Buttons rendered in CustomerRoster.astro carry `data-*` attributes with IDs and field values.
Event handlers in admin.astro's `<script>` block read those attributes at click time via `querySelectorAll`.
JS event logic never lives inside CustomerRoster.astro.

### CustomerGroup Types
```ts
interface YardGroup {
  yard_id: number; label: string | null; address: string;
  frequency: string; quoted_price: number | null;
  last_cut: string | null; last_price: number | null; total_cuts: number;
}
interface CustomerGroup {
  customer_id: number; customer_name: string;
  phone: string | null; customer_notes: string | null;
  yards: YardGroup[];
}
```

### Admin Query Pattern
```sql
SELECT
  c.id as customer_id, c.name as customer_name, c.phone, c.notes as customer_notes,
  y.id as yard_id, y.label, y.address, y.frequency, y.quoted_price,
  MAX(cu.cut_date) as last_cut, COUNT(cu.id) as total_cuts,
  (SELECT price FROM cuts WHERE yard_id = y.id ORDER BY cut_date DESC, id DESC LIMIT 1) as last_price
FROM customers c
LEFT JOIN yards y ON y.customer_id = c.id AND y.active = 1
LEFT JOIN cuts cu ON cu.yard_id = y.id
WHERE c.active = 1
GROUP BY c.id, y.id
ORDER BY c.name, y.id
```
Then group flat rows into `CustomerGroup[]` in TypeScript before passing to `CustomerRoster`.

---

## Auth

- Google OAuth 2.0 with PKCE — routes: `/auth/login` → `/auth/callback`
- Session cookie: `gw_admin=authorized` — httpOnly, secure, sameSite strict, 7-day maxAge
- All API routes check `cookies.get('gw_admin')?.value !== 'authorized'` before acting
- Admin email allowlist enforced via env var

---

## Color Palette (Tailwind tokens in `src/styles/global.css`)

| Token | Value | Use |
|-------|-------|-----|
| `bg-army` / `text-army` | #0F2C23 | page background |
| `bg-olive` / `text-olive` | #1E3F2F | panel/card background |
| `border-camo` | #4b5320 | borders, accents |
| `text-deere` / `bg-deere` | #FACC15 | headings, CTAs |
| `text-screaming` / `bg-screaming` | #4ADE80 | success, green highlights |
| `text-rust` / `bg-rust` | #F97316 | danger, payments |
| `text-dirt` / `bg-dirt` | #78350f | brown accents |

Tokens defined with `@theme {}` syntax. Never use raw hex values in components — use tokens.

---

## AI Editing Rules

1. Do NOT rewrite entire files unless explicitly instructed
2. Modify the smallest possible section of code
3. Preserve formatting and existing structure
4. Do not rename files or folders unless instructed
5. Explain or show the change before applying it
6. Do not suggest Yarn, Bun, Netlify, Vercel, Prisma, or Supabase

---

## Database Safety

- Never modify schema, migrations, or auth logic without explicit instruction
- `seed.sql` is DEV ONLY — only run with `--local` flag, NEVER `--remote`
- `seed.sql` is currently outdated for the new schema — do not run until updated
- `migrations/` contains production-applied migrations — do not re-run them
- D1 has FK enforcement ON — use `PRAGMA foreign_keys = OFF;` in migration files when dropping referenced tables

---

## Deployment Safety

- Do not change `wrangler.jsonc`, Cloudflare bindings, or env vars without explicit instruction
- Always run `npm run build` (zero errors) before pushing

---

## Known Constraints

- **`AdminLayout.astro`** — Do not touch. Stable outer shell.
- **`output: 'hybrid'`** — Does not exist in Astro 5. Use `output: 'server'`. Static pages use `export const prerender = true`.
- **Tailwind v4** — Config lives in `astro.config.mjs` via `@tailwindcss/vite`. No `tailwind.config.*` file.
- **`@theme {}`** — Defines color tokens in `src/styles/global.css`. Not `extend.colors`.
- **`src/env.d.ts`** — Declares `App.Locals extends Runtime<CloudflareEnv>` for D1/env typing.
- **Payments** — Manual logging only (cash, check, Venmo, Zelle). No payment processor. No credit cards. Ever.
