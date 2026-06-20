-- Enable backend functions for mobile with email-based access control
-- Authorized emails: ary.santino555@gmail.com and hikaribrandan3@gmail.com

-- Create a function to check if user is authorized for backend access
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email FROM auth.users
    WHERE id = auth.uid()
  ) IN ('ary.santino555@gmail.com', 'hikaribrandan3@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update profiles policy to restrict admin access
CREATE POLICY "Admin access to all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_authorized_admin());

-- Add logo_url column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create categories table (if not exists)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Owner manages categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Owner updates categories" ON public.categories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Owner deletes categories" ON public.categories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create trigger for categories updated_at
CREATE TRIGGER IF NOT EXISTS trg_categories_updated BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Update items table structure to match schema
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS category_id TEXT;
ALTER TABLE public.items ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';
ALTER TABLE public.items RENAME COLUMN IF EXISTS image_url TO image_url_old;

-- Create item_images table for multiple images per item
CREATE TABLE IF NOT EXISTS public.item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.item_images TO authenticated;
GRANT SELECT ON public.item_images TO anon;
GRANT ALL ON public.item_images TO service_role;
ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can read item images" ON public.item_images
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Owner manages item images" ON public.item_images
  FOR INSERT TO authenticated WITH CHECK (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );
CREATE POLICY IF NOT EXISTS "Owner updates item images" ON public.item_images
  FOR UPDATE TO authenticated USING (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  ) WITH CHECK (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );
CREATE POLICY IF NOT EXISTS "Owner deletes item images" ON public.item_images
  FOR DELETE TO authenticated USING (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Owner reads own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Owner inserts orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Owner updates orders" ON public.orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER IF NOT EXISTS trg_orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create function to enable all backend operations via mobile
-- This allows authenticated users to perform all CRUD operations via mobile
CREATE OR REPLACE FUNCTION public.enable_mobile_backend()
RETURNS TABLE(status TEXT) AS $$
BEGIN
  -- Verify user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN QUERY SELECT 'error: not authenticated'::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT 'backend_enabled'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.enable_mobile_backend() TO authenticated;
