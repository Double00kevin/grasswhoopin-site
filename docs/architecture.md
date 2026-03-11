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

## Admin Dashboard Components

```
src/layouts/AdminLayout.astro     — page shell, header, sticky nav
src/components/AdminStats.astro   — metric cards (customers, cuts, revenue, total owed)
src/components/CustomerRoster.astro — 2-col grid of customer cards with action buttons
src/pages/admin.astro             — controller: auth, DB queries, flash params, composition
```

## API Routes

```
src/pages/api/customers.ts   — POST: add customer | PUT: edit | DELETE: discharge | PATCH: reinstate
src/pages/api/cuts.ts        — POST: log a cut (GRASSWHOOPED)
src/pages/api/payments.ts    — POST: record manual payment (cash/check/Venmo — NO card processing)
```

All API routes:
- Check `gw_admin` cookie before any action
- Use Astro context `redirect()` helper for redirects
- Wrapped in try/catch; errors redirect to `/admin?error=1`
