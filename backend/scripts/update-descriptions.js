/**
 * Script de mise à jour des descriptions des véhicules.
 * Usage : node backend/scripts/update-descriptions.js
 */
const pool = require('../config/db');

const updates = [
  {
    marque: 'Renault',
    modele_like: '%Clio%Alpine%',
    description:
      "Sportivité accessible et caractère affirmé. La Clio Alpine conjugue un châssis sport affiné, un moteur essence vif et une finition exclusive pour une conduite engagée au quotidien.",
  },
  {
    marque: 'Mercedes',
    modele_like: '%A250e%',
    description:
      "Mercedes Classe A 250e (221 ch) avec Pack AMG, toit ouvrant, siège électrique, Apple CarPlay, aide au stationnement, éclairage LED, modes Eco/Confort/Sport, chargeur smartphone sans fil et caméra 360.",
  },
  {
    marque: 'Mini',
    modele_like: '%Cooper%',
    description:
      "Cooper Camden 136 ch avec Apple CarPlay, aides à la conduite, toit ouvrant panoramique, couleur exclusive, éclairage LED d'intérieur et système audio Harman Kardon.",
  },
  {
    marque: 'BMW',
    modele_like: '%120%i%',
    description:
      "BMW 120i noire : 3 cylindres 1.5L turbo (170 ch, 280 Nm), boîte auto DCT7 traction, 0 à 100 km/h en ~7,8 s, vitesse max ~226 km/h, conso ~5,3 L/100 km, longueur 4,36 m, poids 1 450 kg, coffre 300L. Options : Pack extérieur M, jantes 18\", Apple CarPlay, toit ouvrant panoramique, sièges chauffants, full LED/LED advanced, Harman Kardon, caméra de recul et radar.",
  },
];

const run = async () => {
  try {
    for (const { marque, modele_like, description } of updates) {
      const res = await pool.query(
        `UPDATE vehicules
         SET description = $1
         WHERE LOWER(marque) = LOWER($2)
           AND modele ILIKE $3
         RETURNING id, marque, modele`,
        [description, marque, modele_like]
      );
      if (res.rows.length > 0) {
        res.rows.forEach(r => console.log(`✅ Mis à jour : #${r.id} ${r.marque} ${r.modele}`));
      } else {
        console.log(`ℹ️  Ignoré (véhicule introuvable) : ${marque} ${modele_like}`);
      }
    }
  } catch (err) {
    console.error('Erreur :', err.message);
  } finally {
    await pool.end();
  }
};

run();
