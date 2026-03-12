# GrassWhoopin' Site — AI Context
> Last updated: 2026-03-12

## Project Identity
Lawn-care CRM and admin dashboard. Single operator. Private internal tool.
Brand voice: lawns are "whooped," customers are "recruits." Southern, loud, military-coded.
Repo: `~/projects/grasswhoopin-site`

---

## Stack
| | |
|---|---|
| Framework | Astro v5, `output: 'server'` (SSR) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` — tokens in `src/styles/global.css` |
| Deployment | Cloudflare Pages — auto-deploy on push to `main` |
| Database | Cloudflare D1, binding: `grasswhoopin_db` |
| Runtime | Cloudflare Workers via `@astrojs/cloudflare` adapter |
| Package manager | npm only — never Yarn or Bun |

---

## Commands
```sh
npm run dev        # localhost:4321
npm run build      # must pass zero errors before any push
git add -A && git commit -m "msg" && git push  # deploys to Cloudflare (~1-2 min)

# Local DB setup (run once)
npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql

# Remote migration
npx wrangler d1 execute grasswhoopin-db --remote --file=migrations/<file>.sql
```

---

## Database
4 tables defined in `schema.sql`. See `docs/database.md` for full schema.

- `customers` — billing/contact only (name, phone, notes, active)
- `yards` — one per property, FK → customers.id (address, label, frequency, quoted_price, active)
- `cuts` — per yard, FK → yards.id (cut_date, price, notes)
- `payments` — per customer, FK → customers.id (amount, paid_date, notes)

Migration `001_customers_yards.sql` applied 2026-03-11. `customers_backup` dropped from production.

`seed.sql` is DEV ONLY and currently OUTDATED — do not run until updated.

Runtime DB access:
- `.astro` pages: `Astro.locals.runtime.env.grasswhoopin_db`
- API routes: `locals.runtime.env.grasswhoopin_db`

---

## Architecture
See `docs/architecture.md` for full component and route breakdown.

**Key files:**
- `src/layouts/AdminLayout.astro` — DO NOT TOUCH
- `src/components/CustomerRoster.astro` — accepts `CustomerGroup[]`, type defined in `src/pages/admin.astro`
- `src/pages/admin.astro` — auth, DB queries, grouping logic, all JS event handlers
- `src/pages/index.astro` — public homepage, imports Nav + Hero

**API routes** (all require `gw_admin` cookie):
- `POST /api/enlist` — create customer + first yard atomically
- `PUT|DELETE|PATCH /api/customers` — edit / discharge / reinstate customer
- `POST|PUT|DELETE|PATCH /api/yards` — add / edit / remove / reinstate yard
- `POST /api/cuts` — log a cut by `yard_id`
- `POST /api/payments` — manual payment only (cash/check/Venmo/Zelle — NO card processing, ever)

**Auth:** Google OAuth 2.0 PKCE — `/auth/login` → `/auth/callback` → `gw_admin` cookie (7-day)

---

## Color Tokens (`src/styles/global.css`)
`army` #0F2C23 | `olive` #1E3F2F | `camo` #4b5320 | `deere` #FACC15 | `screaming` #4ADE80 | `rust` #F97316 | `dirt` #78350f

Never use raw hex in components — use tokens only.

---

## Hard Rules
- NEVER rewrite entire files unless explicitly instructed — smallest diff only
- NEVER suggest Yarn, Bun, Netlify, Vercel, Prisma, or Supabase
- NEVER modify schema, migrations, or auth without explicit instruction
- NEVER run `seed.sql` with `--remote`
- NEVER add card processing or payment APIs of any kind
- `output: 'hybrid'` does not exist in Astro 5 — use `output: 'server'`
- Tailwind v4 has no `tailwind.config.*` — config is in `astro.config.mjs`
- Any page needing SSR requires `export const prerender = false`
- Payments are manual logging only — no processor, no cards, ever

---

## Close The Loop
When operator types "close the loop" — stop everything and execute this checklist in order.
Do not skip any item. Do not ask for permission. Just do it.

**1. Update `.claude/CLAUDE.md`**
- Reflect any stack, schema, route, or component changes made this session
- Update the `Last updated` date at the top

**2. Update `docs/database.md`**
- If any table, column, or migration changed — update the schema tables
- If a migration was applied — add it to the Migration History section
- If any cleanup tasks are pending — list them explicitly

**3. Update `docs/architecture.md`**
- If any component, route, or API endpoint was added, removed, or changed — update it
- If the data flow or component hierarchy changed — update it

**4. Update `docs/changelog.md`**
- Add a dated entry for everything shipped this session
- Format: `## YYYY-MM-DD` then bullet points per change
- Be specific — file names, what changed, why

**5. Report status**
After completing all four — respond with:
- What was updated and a one-line summary of each change
- Any items that had nothing to update (and why)
- Any loose threads or production tasks still pending