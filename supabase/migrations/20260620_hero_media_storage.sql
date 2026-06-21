-- Create hero-media storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT DO NOTHING;

-- Allow anyone to read hero media (public)
CREATE POLICY "Public can read hero media" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'hero-media');

-- Allow owners to upload their own hero media
CREATE POLICY "Owner can upload hero media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'hero-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow owners to update/delete their own hero media
CREATE POLICY "Owner can update hero media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'hero-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Owner can delete hero media" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'hero-media'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
