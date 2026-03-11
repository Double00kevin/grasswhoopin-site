# Changelog

## 2026-03-10

### Admin Dashboard Visual Overhaul
- **AdminStats.astro**: Rebuilt metric cards — label above value, colored left-border accent, left-aligned layout matching Jobber/Yardbook style
- Added **Total Owed** metric card (rust color) — computed via `SUM(cuts.price) - SUM(payments.amount)`; replaces Revenue All-Time display
- New `totalOwed` prop added; four stat vars changed from `const` to `let` in admin.astro
- **CustomerRoster.astro**: Layout changed from vertical list to responsive 2-column grid
- Customer cards: green left-border accent, larger name heading, stacked info, footer action bar
- GRASSWHOOPED form: removed `$` price input — one-click submit only (quoted price used from DB)
- Added **RECORD PAYMENT** form per card (rust styling, posts to `/api/payments`)
- EDIT + DISCHARGE buttons de-emphasized to secondary row

### New: /api/payments Endpoint
- Manual payment logging only — cash, check, Venmo, Zelle, no card processing
- Reads `customer_id` + `amount`, INSERTs into `payments` table
- Success: redirect to `/admin?payment=1` | Error: redirect to `/admin?error=1`
- Added `?payment=1` flash banner (green) in admin.astro

### API Route Fixes
- Fixed redirect pattern in `/api/cuts` and `/api/payments` — reverted to Astro context `redirect()` helper (matches working `/api/customers` pattern)
- Both routes wrapped in try/catch with `console.error` logging

### Local Dev Seeding
- Created `seed.sql` — 5 realistic Tennessee customers + cut history + payments (DEV ONLY)
- Removed JS dummy data block from admin.astro
- Proper local dev workflow: `npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql` then `seed.sql`

---

## 2026-03-07
- Fixed Google OAuth client/runtime issues
- Fixed redirect URI mismatch by using dynamic callback URL
- Fixed admin route redirect from /login to /auth/login
- Confirmed successful login to /admin on workers.dev
