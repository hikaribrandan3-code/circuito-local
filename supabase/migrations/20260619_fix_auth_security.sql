-- Fix authentication and RLS policies to be more accessible
-- This allows users to access their own data without overly restrictive policies

-- Drop the overly restrictive admin profile policy if it exists
DROP POLICY IF EXISTS "Admin access to all profiles" ON public.profiles;

-- Update profiles to allow users to read their own profile
DROP POLICY IF EXISTS "Owner manages own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Ensure the profile exists for the user (UUID: 765f2710-ef09-425b-accd-40abb6520318)
INSERT INTO public.profiles (id, phone, contact_info, shop_url, logo_url)
VALUES (
  '765f2710-ef09-425b-accd-40abb6520318'::UUID,
  NULL,
  NULL,
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Simplify categories access - allow users to see all categories but only manage their own
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Owner manages categories" ON public.categories;
DROP POLICY IF EXISTS "Owner updates categories" ON public.categories;
DROP POLICY IF EXISTS "Owner deletes categories" ON public.categories;

CREATE POLICY "Anyone can read categories" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create categories" ON public.categories
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Simplify items access
DROP POLICY IF EXISTS "Public can read items" ON public.items;
DROP POLICY IF EXISTS "Owner inserts own items" ON public.items;
DROP POLICY IF EXISTS "Owner updates own items" ON public.items;
DROP POLICY IF EXISTS "Owner deletes own items" ON public.items;

CREATE POLICY "Anyone can read items" ON public.items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create items" ON public.items
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON public.items
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON public.items
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Simplify item_images access
DROP POLICY IF EXISTS "Public can read item images" ON public.item_images;
DROP POLICY IF EXISTS "Owner manages item images" ON public.item_images;
DROP POLICY IF EXISTS "Owner updates item images" ON public.item_images;
DROP POLICY IF EXISTS "Owner deletes item images" ON public.item_images;

CREATE POLICY "Anyone can read item images" ON public.item_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Users can add images to own items" ON public.item_images
  FOR INSERT TO authenticated WITH CHECK (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );

CREATE POLICY "Users can update own item images" ON public.item_images
  FOR UPDATE TO authenticated USING (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );

CREATE POLICY "Users can delete own item images" ON public.item_images
  FOR DELETE TO authenticated USING (
    (SELECT user_id FROM public.items WHERE id = item_id) = auth.uid()
  );

-- Simplify orders access
DROP POLICY IF EXISTS "Owner reads own orders" ON public.orders;
DROP POLICY IF EXISTS "Owner inserts orders" ON public.orders;
DROP POLICY IF EXISTS "Owner updates orders" ON public.orders;

CREATE POLICY "Users can read own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Drop the overly restrictive authorization function - it's not needed if using proper RLS
DROP FUNCTION IF EXISTS public.is_authorized_admin();
DROP FUNCTION IF EXISTS public.enable_mobile_backend();
