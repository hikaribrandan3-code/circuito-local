-- Gallery posts table for Instagram section
CREATE TABLE IF NOT EXISTS public.gallery_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read gallery" ON public.gallery_posts
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Owner can manage gallery" ON public.gallery_posts
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public can read gallery storage" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Owner can upload gallery" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Owner can delete gallery" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
