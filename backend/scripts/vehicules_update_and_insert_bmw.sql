-- Mettre a jour les descriptions des vehicules existants
UPDATE vehicules
SET description = 'Mercedes Classe A 250e (221 ch) avec Pack AMG, toit ouvrant, siege electrique, Apple CarPlay, aide au stationnement, eclairage LED, modes Eco/Confort/Sport, chargeur smartphone sans fil et camera 360.'
WHERE LOWER(marque) = 'mercedes'
  AND modele ILIKE '%a250e%';

UPDATE vehicules
SET description = 'Cooper Camden 136 ch avec Apple CarPlay, aides a la conduite, toit ouvrant panoramique, couleur exclusive, eclairage LED d''interieur et systeme audio Harman Kardon.'
WHERE LOWER(marque) = 'mini'
  AND modele ILIKE '%cooper%';

-- Ajouter la BMW 120i si elle n'existe pas deja
-- Adapte les valeurs marquees A_COMPLETER avant execution si necessaire.
INSERT INTO vehicules (
  marque,
  modele,
  annee,
  immatriculation,
  type_boite,
  carburant,
  places,
  prix_base_journalier,
  image_url,
  description,
  statut,
  date_creation
)
SELECT
  'BMW',
  '120I',
  2024,
  'A_COMPLETER',
  'Automatique DCT7',
  'Essence',
  5,
  0,
  'bmw-120i',
  'BMW 120i noire : 3 cylindres 1.5L turbo (170 ch, 280 Nm), boite auto DCT7 traction, 0 a 100 km/h en ~7,8 s, vitesse max ~226 km/h, conso ~5,3 L/100 km, longueur 4,36 m, poids 1 450 kg, coffre 300L. Options : Pack exterieur M (pare-chocs, jantes 18'' noir brillant), Apple CarPlay, toit ouvrant panoramique, siege chauffant, full LED/LED advanced, Harman Kardon, camera de recul + radar.',
  'disponible',
  NOW()
WHERE NOT EXISTS (
  SELECT 1
  FROM vehicules
  WHERE LOWER(marque) = 'bmw'
    AND LOWER(modele) IN ('120i', 'serie 1 120i')
);
