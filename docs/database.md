# Database

## Backend
Cloudflare D1

## Purpose
Store recruits/customers and operational admin data.

## Schema

Defined in `schema.sql` at the project root.

### customers
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| name | TEXT NOT NULL | |
| address | TEXT NOT NULL | |
| phone | TEXT | nullable |
| frequency | TEXT | weekly / bi-weekly / monthly / one-time |
| quoted_price | REAL | nullable, shown as badge on card |
| notes | TEXT | nullable |
| active | INTEGER | 1 = active, 0 = discharged |
| created_at | TEXT | datetime('now') |

### cuts
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| customer_id | INTEGER NOT NULL | FK → customers.id |
| cut_date | TEXT NOT NULL | date('now') default |
| price | REAL | nullable (quoted price used if blank) |
| notes | TEXT | nullable |
| created_at | TEXT | datetime('now') |

### payments
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | autoincrement |
| customer_id | INTEGER NOT NULL | FK → customers.id |
| amount | REAL NOT NULL | manual payment amount |
| paid_date | TEXT NOT NULL | date('now') default |
| notes | TEXT | nullable |
| created_at | TEXT | datetime('now') |

---

## Local Dev Seeding

A `seed.sql` file exists in the project root with realistic test data (5 customers, cut history, payments).

**Run once to set up local dev DB:**
```sh
npx wrangler d1 execute grasswhoopin-db --local --file=schema.sql
npx wrangler d1 execute grasswhoopin-db --local --file=seed.sql
```

**WARNING: Never run seed.sql with `--remote` — that targets the live production database.**

---

## Notes
- Admin dashboard reads live data from production D1
- Local D1 (Miniflare) is a completely separate SQLite file — safe to experiment with
