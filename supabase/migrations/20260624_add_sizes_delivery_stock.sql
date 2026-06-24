-- Add sizes, stock management, and delivery fields to ASB Store

-- 1. Add sizes JSON array to items (for clothing)
ALTER TABLE items ADD COLUMN IF NOT EXISTS has_sizes BOOLEAN DEFAULT FALSE;
ALTER TABLE items ADD COLUMN IF NOT EXISTS sizes JSONB DEFAULT '{"XS": true, "S": true, "M": true, "L": true, "XL": true, "XXL": true}';

-- 2. Add stock status column if not exists
ALTER TABLE items ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'low_stock'));

-- 3. Add category_id column if not exists
ALTER TABLE items ADD COLUMN IF NOT EXISTS category_id TEXT;

-- 4. Add delivery settings table
CREATE TABLE IF NOT EXISTS delivery_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delivery_enabled BOOLEAN DEFAULT true,
  delivery_price INTEGER NOT NULL DEFAULT 5000, -- in cents (ARS)
  free_pickup_enabled BOOLEAN DEFAULT true,
  delivery_radius_km INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 5. Create orders table for tracking purchases
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_size TEXT,
  delivery_method TEXT CHECK (delivery_method IN ('delivery', 'pickup')), -- delivery or pickup
  total_price INTEGER NOT NULL,
  customer_location POINT, -- lat, lon for delivery
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable RLS on new tables
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own delivery settings
CREATE POLICY "delivery_settings_user_access" ON delivery_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only see their own orders
CREATE POLICY "orders_user_access" ON orders
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_item_id ON orders(item_id);
CREATE INDEX IF NOT EXISTS idx_delivery_settings_user_id ON delivery_settings(user_id);
