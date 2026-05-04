-- Ajouter la colonne pour tracker l'envoi de l'email de bienvenue
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS welcome_sent_at TIMESTAMPTZ;
