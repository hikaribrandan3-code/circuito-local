-- Inventory: numeric stock count per product (replaces the status-only toggle
-- as the source of truth; stock_status is now derived from stock_quantity
-- and kept in sync by the app on every save).
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;

-- Orders: fulfillment state, used to gate manual stock decrement.
-- Checkout only opens WhatsApp — it is not a payment confirmation — so stock
-- must NOT decrement automatically on order insert. The owner marks an order
-- "fulfilled" once they've actually packed/sold it, which decrements stock
-- exactly once (idempotent, since status flips away from 'pending').
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'fulfilled', 'cancelled'));

-- CRM: normalized customer identity, deduped by phone number per store.
-- Aggregates (order count, total spent, last order date) are computed at
-- query time from `orders` rather than stored here, so they can never drift
-- out of sync the way the orders schema already has once.
-- Named `shop_customers` (not `customers`) because this Supabase project is
-- shared with unrelated products that already have their own `customers`
-- table (a signup/activation table with a completely different schema —
-- see report). Do not rename this back without checking for that collision.
CREATE TABLE IF NOT EXISTS shop_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_shop_customers_user_id ON shop_customers(user_id);

-- Matches the rest of this project's tables: RLS disabled, single-owner
-- store with the public anon key used for both storefront and admin reads.
ALTER TABLE shop_customers DISABLE ROW LEVEL SECURITY;
