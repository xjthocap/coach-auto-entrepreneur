-- Badge spécial créateur — le patron de keskireste
-- À activer une seule fois :
--   UPDATE profiles SET is_patron = TRUE WHERE id = '<ton_user_id>';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_patron BOOLEAN DEFAULT FALSE;
