# PROJECT_CONTEXT.md — grasswhoopin-site

## Purpose
Lawn-care operations dashboard and admin system built with:

- Astro v5 (SSR)
- Cloudflare Workers / Pages
- Cloudflare D1 database
- Google OAuth authentication

Primary function: manage customers ("recruits"), track lawn cuts, and view operational stats.

---

## Repo Location

Local development path:

~/projects/grasswhoopin-site

Deployment pipeline:

Local → GitHub → Cloudflare Pages auto-deploy

Primary runtime environment:

Development: Ubuntu 24.04 (KITT server)
Node: npm-based workflow
Deployment: GitHub → Cloudflare Pages auto-build

---

## Canonical Technical Truth

This file intentionally stays **thin**.

All authoritative technical details live in the `docs/` directory:

- docs/architecture.md
- docs/auth.md
- docs/database.md
- docs/deployment.md
- docs/changelog.md
- docs/CHEATSHEET.md

Do **not duplicate implementation details here**.

---

## How to Use This File

When starting a new AI development session:

1. Paste this entire file at the top of the conversation.
2. Instruct the AI to treat it as **high-level architectural context only**.
3. Direct the AI to `docs/*` for detailed implementation references.

Goal: keep AI threads consistent without bloating this file.

---

## Admin Dashboard Architecture

The admin dashboard uses a **componentized Astro architecture**.

### Layout

src/layouts/
AdminLayout.astro
Responsibilities:

- page shell
- header / command center UI
- layout container
- global styles

---

### Components

src/components/
AdminStats.astro
CustomerRoster.astro


**AdminStats.astro**

Displays operational metrics (Jobber-style cards with colored left-border accents):

- active customers
- yards cut this month
- revenue this month
- total owed (cuts total minus payments total)

**CustomerRoster.astro**

Handles roster UI and interaction logic:

- 2-column responsive grid of customer cards
- empty state message
- customer cards with GRASSWHOOPED, RECORD PAYMENT, EDIT, DISCHARGE actions
- edit modal trigger (data-* attrs preserved for JS)
- discharge / reinstate actions

---

### Controller Page


src/pages/
admin.astro


Responsibilities:

- authentication validation
- database queries
- flash message handling
- composing UI components

Example structure:

```astro
<AdminLayout>

  <AdminStats
    totalCustomers={customers.length}
    cutsMonth={cutsMonth}
    revenueMonth={revenueMonth}
    revenueAll={revenueAll}
    totalOwed={totalOwed}
  />

  Recruit Form

  <CustomerRoster
    customers={customers}
    discharged={discharged}
  />

</AdminLayout>
```

The page acts as the controller layer, while UI logic lives in components.

### API Routes

```
src/pages/api/customers.ts   — POST: add | PUT: edit | DELETE: discharge | PATCH: reinstate
src/pages/api/cuts.ts        — POST: log a cut (GRASSWHOOPED)
src/pages/api/payments.ts    — POST: record manual payment (cash/check/Venmo — no card processing)
```

Last updated: 2026-03-10