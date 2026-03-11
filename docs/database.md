# Database

## Backend
Cloudflare D1

## Purpose
Store recruits/customers, yards (properties), cut records, and payments.

## Schema

Defined in `schema.sql` at the project root.

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
| quoted_price | REAL | nullable, shown as badge on yard card |
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
| amount | REAL NOT NULL | manual payment amount |
| paid_date | TEXT NOT NULL | date('now') default |
| notes | TEXT | nullable |
| created_at | TEXT | datetime('now') |

---

## Migration History

| File | Date | Description |
|------|------|-------------|
| `migrations/001_customers_yards.sql` | 2026-03-11 | Separated customers (billing) from yards (properties); migrated cuts.customer_id → cuts.yard_id |

> **Production cleanup needed:** A `customers_backup` table exists in production D1 from the 001 migration. Run `DROP TABLE customers_backup;` after confirming data integrity.

---

## Local Dev Seeding

> **Warning:** `seed.sql` is currently outdated for the new schema (written before yards table existed). Do not run it until it has been updated.

**Set up a clean local DB:**
```sh
npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql
```

**WARNING: Never run seed.sql with `--remote` — that targets the live production database.**

---

## Notes
- Admin dashboard reads live data from production D1
- Local D1 (Miniflare) is a completely separate SQLite file — safe to experiment with
- D1 has FK enforcement ON — use `PRAGMA foreign_keys = OFF;` in migration files when dropping tables that are referenced by FKs
