# Changelog

## 2026-03-12

### Public Site — Nav + Hero Updates

**Nav (`src/components/Nav.astro`) — new component:**
- Created sticky fixed nav with three elements: GRASSWHOOPIN' brand left, "Out whoopin' grass right now →" italic tagline + "TEXT US!!" CTA button grouped right
- Tagline: italic Barlow Condensed, text-gray-300 (#d1d5db), no link
- CTA: yellow (#f2c200) Barlow Condensed 900, links to SMS `256-929-0532`
- All three elements visible at all screen sizes (no mobile hide)
- Imported into `src/pages/index.astro`

**Hero (`src/components/Hero.astro`) — updates:**
- Reduced mascot height multiplier from `4.75` to `3.52` (matches row height) to prevent mascot from overflowing above the fixed nav bar
- Added `mascot.mp4` to `public/` (moved from `dist/`) for future use — currently not displayed (static `mascot.png` in use)
- Removed bottom-cta section content: "We'll handle it." tagline, "Best way to reach us?" tagline, and the TEXT US NOW button/aside (CTA moved to Nav)
- Removed `gap` from `.bottom-cta` since section is now empty

---

## 2026-03-11

### Clickable Address → Google Maps Directions
- **UI:** Yard addresses in admin roster are now tappable links. Tapping opens Google Maps in directions mode to that address. Works on mobile (launches Maps app) and desktop.

### Phone Number Display Formatting
- **UI:** Phone numbers now display as `XXX-XXX-XXXX` on the admin roster (`CustomerRoster.astro`). Raw value unchanged in `data-phone` — edit modal unaffected.

### Multi-Yard Support (customers/yards schema)
- **Schema**: Separated billing contacts (customers) from properties (yards). `customers` table is now billing-only (name, phone, notes, active). New `yards` table holds address, label, frequency, quoted_price per property.
- **Migration**: `migrations/001_customers_yards.sql` — applied to production D1 remote. Includes `customers_backup` (needs manual `DROP TABLE customers_backup;` after data verification).
- **cuts**: now reference `yard_id` instead of `customer_id`
- **New route**: `src/pages/api/yards.ts` — POST/PUT/DELETE/PATCH for yard management
- **New route**: `src/pages/api/enlist.ts` — POST creates customer + first yard atomically
- **Updated**: `src/pages/api/customers.ts` — PUT now only updates name/phone/notes; POST removed (moved to /api/enlist)
- **Updated**: `src/pages/api/cuts.ts` — uses `yard_id` instead of `customer_id`
- **Updated**: `src/pages/admin.astro` — new grouped query (LEFT JOIN yards), TypeScript grouping into CustomerGroup[], two enlist form sections, two edit modals, updated JS handlers
- **Updated**: `src/components/CustomerRoster.astro` — full rewrite; accepts `CustomerGroup[]` props; renders nested yard cards per customer with per-yard GRASSWHOOPED/EDIT/REMOVE and customer-level RECORD PAYMENT/ADD YARD/EDIT/DISCHARGE
- **Local DB**: cleared and re-seeded from schema.sql (seed.sql is outdated — needs update for new schema before it can be used)

---

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
