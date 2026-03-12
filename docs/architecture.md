# Architecture

## Purpose
Admin/control system for GrassWhoopin operations.

## Stack
- Astro SSR
- Cloudflare Workers
- Cloudflare D1
- Google OAuth via Arctic
- Cookie-based admin session

## Main Runtime Flow
Browser
→ Cloudflare Worker
→ Astro SSR routes/pages
→ D1 database

---

## Public Site Components

```
src/components/Nav.astro   — fixed sticky nav: GRASSWHOOPIN' brand left | italic tagline + CTA grouped right
src/components/Hero.astro  — full-viewport hero: word stack left, mascot right, GRASSWHOOPIN'? big line, empty bottom-cta row
src/pages/index.astro      — public homepage: imports Nav + Hero
```

### Nav.astro
Three elements in one flex row at all screen sizes:
- Left: GRASSWHOOPIN' brand link (#7fe832, Barlow Condensed 900)
- Right group (`.nav-right`): italic tagline "Out whoopin' grass right now →" + yellow CTA "TEXT US!!" → SMS link

### Hero.astro
- Mascot height: `3.52 × clamp(4rem, 8vw, 9rem)` — matches row height, no upward overflow past nav
- `bottom-cta` section is present but empty (CTA moved to Nav)
- `public/mascot.mp4` exists for future use; current display uses static `mascot.png`

---

## Admin Dashboard Components

```
src/layouts/AdminLayout.astro     — page shell, header, sticky nav (DO NOT TOUCH)
src/components/AdminStats.astro   — metric cards (customers, cuts, revenue, total owed)
src/components/CustomerRoster.astro — grouped customer+yard cards with action buttons
src/pages/admin.astro             — controller: auth, DB queries, TypeScript grouping, flash params, composition
```

### CustomerRoster.astro
Accepts `customerGroups: CustomerGroup[]` prop. Each CustomerGroup contains:
- Customer-level fields: `customer_id`, `customer_name`, `phone`, `customer_notes`
- Nested `yards: YardGroup[]` — one entry per active yard

Renders one customer block per customer with stacked yard cards inside.

**Per-customer actions:** RECORD PAYMENT (at customer level), + ADD YARD (inline form), EDIT, DISCHARGE

**Per-yard actions:** GRASSWHOOPED, EDIT YARD, REMOVE YARD

**Yard address** renders as a tappable link (`<a>`) pointing to `https://www.google.com/maps/dir/?api=1&destination=<encoded address>`. Opens Google Maps in directions mode; launches Maps app on mobile.

### data-* Cross-Boundary Pattern
Buttons in CustomerRoster.astro carry `data-*` attributes with IDs and field values.
Event handlers (`querySelectorAll`) live in admin.astro's `<script>` block and read those attributes at click time.
Never put JS event logic inside CustomerRoster.astro.

### Modals (in admin.astro)
- `#edit-customer-modal` — edits name, phone, notes via PUT `/api/customers?id=X`
- `#edit-yard-modal` — edits label, address, frequency, quoted_price via PUT `/api/yards?id=X`

---

## API Routes

```
src/pages/api/enlist.ts      — POST: create customer + first yard atomically → /admin?added=1
src/pages/api/customers.ts   — PUT: edit name/phone/notes | DELETE: discharge | PATCH: reinstate
src/pages/api/yards.ts       — POST: add yard | PUT: edit | DELETE: discharge | PATCH: reinstate
src/pages/api/cuts.ts        — POST: log a cut by yard_id (GRASSWHOOPED) → /admin?whooped=1
src/pages/api/payments.ts    — POST: record manual payment by customer_id (NO card processing)
```

All API routes:
- Check `gw_admin` cookie before any action
- Use Astro context `redirect()` helper for redirects
- Wrapped in try/catch; errors redirect to `/admin?error=1`
