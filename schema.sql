-- Grasswhoopin' D1 Schema

-- Customers: billing/contact only
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Yards: one per property (many per customer)
CREATE TABLE IF NOT EXISTS yards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  label TEXT,
  address TEXT NOT NULL,
  frequency TEXT DEFAULT 'weekly',
  quoted_price REAL,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Cuts: point to yard_id
CREATE TABLE IF NOT EXISTS cuts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  yard_id INTEGER NOT NULL REFERENCES yards(id),
  cut_date TEXT NOT NULL DEFAULT (date('now')),
  price REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Payments: at customer level (covers all yards)
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  amount REAL NOT NULL,
  paid_date TEXT NOT NULL DEFAULT (date('now')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
