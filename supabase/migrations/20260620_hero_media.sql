-- Add hero media columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hero_media_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_media_type TEXT DEFAULT 'image';

-- Allow public (anon) to read profiles so hero media shows on the storefront
CREATE POLICY "Public can read profiles" ON public.profiles
  FOR SELECT TO anon USING (true);
