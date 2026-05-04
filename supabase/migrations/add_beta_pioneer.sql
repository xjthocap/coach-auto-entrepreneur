-- Badge spécial pour le premier bêta-testeur
-- À activer manuellement dans le dashboard Supabase :
--   UPDATE profiles SET is_beta_pioneer = TRUE WHERE id = '<user_id>';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_beta_pioneer BOOLEAN DEFAULT FALSE;
