-- ─────────────────────────────────────────────────────────────────────────────
-- Migration : logo entreprise
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Colonne logo_url dans profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Storage bucket "logos" (public)
--    → Faire manuellement dans Supabase Dashboard > Storage > New bucket
--      Name: logos  |  Public: ON  |  Max file size: 2 MB  |  Allowed MIME: image/*
-- ─────────────────────────────────────────────────────────────────────────────

-- 3. RLS policies pour le bucket logos
--    (à coller dans Dashboard > Storage > logos > Policies)

-- Policy INSERT : l'utilisateur ne peut uploader que dans son propre dossier
-- CREATE POLICY "users upload own logo"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   bucket_id = 'logos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- Policy UPDATE : idem pour update
-- CREATE POLICY "users update own logo"
-- ON storage.objects FOR UPDATE
-- TO authenticated
-- USING (
--   bucket_id = 'logos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- Policy DELETE : idem pour delete
-- CREATE POLICY "users delete own logo"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (
--   bucket_id = 'logos'
--   AND (storage.foldername(name))[1] = auth.uid()::text
-- );

-- Policy SELECT public (lecture publique pour les PDFs générés)
-- CREATE POLICY "public read logos"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'logos');
