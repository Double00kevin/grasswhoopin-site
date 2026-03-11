-- DEV SEED DATA — local development only, never run against production
-- Apply with: npx wrangler d1 execute grasswhoopin-db --local --file=seed.sql

INSERT INTO customers (name, address, phone, frequency, quoted_price, notes) VALUES
  ('Bobby Earl Tanner',   '214 Mimosa Ln, Ardmore, TN',             '931-555-0142', 'weekly',    55, 'Gate code 1984'),
  ('Rhonda Faye Coble',   '87 Old Boiling Springs Rd, Ardmore, TN', '931-555-0278', 'bi-weekly', 45, 'Dog in backyard'),
  ('Dale Wayne Prisock',  '510 Hwy 273, Elkton, TN',                '931-555-0391', 'bi-weekly', 60, 'Large lot, extra time'),
  ('Tammy Jo Kilpatrick', '33 Crestview Dr, Ardmore, TN',           NULL,           'monthly',   40, NULL),
  ('Cody Lee Maness',     '901 Cedar Ridge Rd, Taft, TN',           '931-555-0467', 'weekly',    70, 'Riding mower access only');

INSERT INTO cuts (customer_id, cut_date, price) VALUES
  (1, '2026-03-08', 55),
  (1, '2026-03-01', 55),
  (1, '2026-02-22', 55),
  (2, '2026-02-22', 45),
  (2, '2026-02-08', 45),
  (3, '2026-03-01', 60),
  (3, '2026-02-15', 60),
  (4, '2026-02-10', 40),
  (5, '2026-03-07', 70),
  (5, '2026-03-01', 70),
  (5, '2026-02-22', 70);

INSERT INTO payments (customer_id, amount, paid_date) VALUES
  (1, 110, '2026-03-02'),
  (5, 140, '2026-03-05');
