-- Grasswhoopin' D1 Schema

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  frequency TEXT DEFAULT 'weekly',
  quoted_price REAL,
  notes TEXT,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Cut log table
CREATE TABLE IF NOT EXISTS cuts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  cut_date TEXT NOT NULL DEFAULT (date('now')),
  price REAL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  amount REAL NOT NULL,
  paid_date TEXT NOT NULL DEFAULT (date('now')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
