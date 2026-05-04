-- Contrainte UNIQUE sur founder_number pour éviter la race condition
-- Si deux webhooks arrivent simultanément, le second échouera avec un conflit
ALTER TABLE profiles ADD CONSTRAINT profiles_founder_number_unique UNIQUE (founder_number);

-- Fonction atomique d'attribution founder (évite le TOCTOU count→insert)
CREATE OR REPLACE FUNCTION assign_founder_number(p_user_id UUID, p_max INT)
RETURNS INT AS $$
DECLARE
  v_count INT;
  v_number INT;
BEGIN
  -- Verrou sur la table pour la durée de la transaction
  LOCK TABLE profiles IN SHARE ROW EXCLUSIVE MODE;

  -- Vérifier si déjà founder
  SELECT founder_number INTO v_number FROM profiles WHERE id = p_user_id;
  IF v_number IS NOT NULL THEN
    RETURN v_number; -- déjà attribué
  END IF;

  -- Compter atomiquement
  SELECT COUNT(*) INTO v_count FROM profiles WHERE founder_number IS NOT NULL;

  IF v_count >= p_max THEN
    RETURN -1; -- cap atteint
  END IF;

  -- Attribuer le prochain numéro
  v_number := v_count + 1;

  UPDATE profiles
  SET founder_number = v_number
  WHERE id = p_user_id;

  RETURN v_number;
END;
$$ LANGUAGE plpgsql;
