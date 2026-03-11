-- Migration: Separate customers (billing) from yards (properties)
-- Run: npx wrangler d1 execute grasswhoopin-db --remote --file migrations/001_customers_yards.sql

PRAGMA foreign_keys = OFF;

-- Step 0: snapshot old customers before any drops
CREATE TABLE customers_backup AS SELECT * FROM customers;

-- Step 1: create + populate new billing-only customers (same IDs)
CREATE TABLE customers_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO customers_new (id, name, phone, notes, active, created_at)
SELECT id, name, phone, notes, active, created_at FROM customers;
DROP TABLE customers;
ALTER TABLE customers_new RENAME TO customers;

-- Step 2: create yards (each old customer row becomes one yard, yard.id = old customer.id)
CREATE TABLE yards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  label TEXT,
  address TEXT NOT NULL,
  frequency TEXT DEFAULT 'weekly',
  quoted_price REAL,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO yards (id, customer_id, label, address, frequency, quoted_price, active, created_at)
SELECT id, id, NULL, address, frequency, quoted_price, active, created_at FROM customers_backup;

-- Step 3: migrate cuts (old customer_id maps 1:1 to new yard.id)
CREATE TABLE cuts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  yard_id INTEGER NOT NULL REFERENCES yards(id),
  cut_date TEXT NOT NULL DEFAULT (date('now')),
  price REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO cuts_new (id, yard_id, cut_date, price, notes, created_at)
SELECT id, customer_id, cut_date, price, notes, created_at FROM cuts;
DROP TABLE cuts;
ALTER TABLE cuts_new RENAME TO cuts;

PRAGMA foreign_keys = ON;

-- payments table is unchanged (customer_id still valid, same IDs preserved)

-- Step 4: drop backup after verifying data is good
-- DROP TABLE customers_backup;
