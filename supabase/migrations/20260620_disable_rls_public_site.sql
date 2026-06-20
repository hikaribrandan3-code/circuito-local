-- Disable RLS for public WhatsApp website
-- Since this is a customer-facing site with no authentication requirements for browsing,
-- RLS policies are disabled to allow public access to all data

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Grant public read access
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.items TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.item_images TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;

-- Allow image uploads (anon users can insert)
GRANT INSERT ON public.item_images TO anon, authenticated;

-- Allow order creation (anon users can insert)
GRANT INSERT ON public.orders TO anon, authenticated;
