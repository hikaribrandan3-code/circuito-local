-- The checked-in 20260624 migration created `orders` with a schema
-- (item_id, quantity, selected_size, total_price, customer_location, status)
-- that the app never actually used. The live production table was altered
-- out-of-band to match what Carrito.tsx/OrdersTab.tsx/AnalyticsTab.tsx
-- actually read and write. This migration brings the migration history back
-- in sync with reality so a fresh `supabase db reset` produces a working
-- checkout instead of failing on every insert.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone TEXT,
  ADD COLUMN IF NOT EXISTS items JSONB,
  ADD COLUMN IF NOT EXISTS total INTEGER,
  ADD COLUMN IF NOT EXISTS customer_latitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS customer_longitude DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS delivery_address TEXT;

-- Confirmed via direct query against production: item_id, quantity,
-- selected_size, total_price, and customer_location from the original
-- CREATE TABLE were never actually created on the live table at all — the
-- table was created out-of-band with only the columns the app uses. Nothing
-- to reconcile for those; this migration only needed the ADD COLUMNs above.
