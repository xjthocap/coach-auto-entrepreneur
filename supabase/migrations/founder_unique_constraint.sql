-- Contrainte UNIQUE sur founder_number pour éviter la race condition
-- Si deux webhooks arrivent simultanément, le second échouera avec un conflit
ALTER TABLE profiles ADD CONSTRAINT profiles_founder_number_unique UNIQUE (founder_number);

-- Fonction atomique d'attribution founder (évite le TOCTOU count→insert)
-- Attribue le plus petit numéro disponible entre 1 et p_max (gère les trous)
CREATE OR REPLACE FUNCTION assign_founder_number(p_user_id UUID, p_max INT)
RETURNS INT AS $$
DECLARE
  v_existing INT;
  v_number INT;
BEGIN
  -- Verrou sur la table pour la durée de la transaction
  LOCK TABLE profiles IN SHARE ROW EXCLUSIVE MODE;

  -- Vérifier si déjà founder → retourner le numéro existant
  SELECT founder_number INTO v_existing FROM profiles WHERE id = p_user_id;
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Trouver le plus petit numéro libre entre 1 et p_max
  SELECT s.n INTO v_number
  FROM generate_series(1, p_max) AS s(n)
  WHERE s.n NOT IN (
    SELECT founder_number FROM profiles WHERE founder_number IS NOT NULL
  )
  ORDER BY s.n
  LIMIT 1;

  -- Aucun numéro disponible → cap atteint
  IF v_number IS NULL THEN
    RETURN -1;
  END IF;

  -- Attribuer le numéro
  UPDATE profiles
  SET founder_number = v_number
  WHERE id = p_user_id;

  RETURN v_number;
END;
$$ LANGUAGE plpgsql;
