# AI_RULES.md — grasswhoopin-site

These rules apply to ANY AI assisting with this repository.

## Primary Context

Read these files first:

- PROJECT_CONTEXT.md
- docs/architecture.md
- docs/database.md
- docs/auth.md
- docs/deployment.md

Do not invent architecture that contradicts these documents.

---

## Editing Rules

When modifying code:

1. Do NOT rewrite entire files unless explicitly instructed.
2. Modify the smallest possible section of code.
3. Preserve formatting and existing structure.
4. Do not rename files or folders unless instructed.

Always show a **diff or explanation** before making large changes.

---

## Repository Standards

Package manager: npm  
Framework: Astro v5  
Styling: Tailwind CSS v4  
Deployment: Cloudflare Pages  
Database: Cloudflare D1

Do not suggest:

- Yarn
- Bun
- Netlify
- Vercel
- Prisma
- Supabase

unless explicitly requested.

---

## Database Safety

Never modify:

- database schema
- migrations
- authentication logic

without explicit instruction.

These are documented in:

docs/database.md
docs/auth.md

**seed.sql is DEV ONLY.** Never run it with `--remote`. It targets the local Miniflare D1 only.
Use `--local` flag exclusively: `npx wrangler d1 execute grasswhoopin-db --local --file=seed.sql`

---

## Deployment Safety

Deployment is automated via:

GitHub → Cloudflare Pages

Do not change:

wrangler.jsonc  
Cloudflare bindings  
environment variables

without explicit instruction.

---

## Component Architecture

Admin dashboard architecture:

layouts/
  AdminLayout.astro

components/
  AdminStats.astro
  CustomerRoster.astro

pages/
  admin.astro

pages/api/
  customers.ts   — customer CRUD
  cuts.ts        — log a cut (GRASSWHOOPED)
  payments.ts    — record manual payment (NO card processing)

Controller logic stays in pages.
UI logic lives in components.
API routes handle form POST actions only.

---

## Safe Workflow

Preferred workflow for changes:

1. Explain the change
2. Show the code modification
3. Wait for approval
4. Apply the change

Avoid destructive edits.

---

Last updated: 2026-03-10
