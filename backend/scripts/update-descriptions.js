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
      "L'hybride rechargeable de la Classe A. La A250e allie la technologie EQ Power de Mercedes à un tempérament sportif, pour une mobilité urbaine premium, économe et sans compromis.",
  },
  {
    marque: 'Mini',
    modele_like: '%Cooper%',
    description:
      "L'icône britannique dans toute son expression. Compacte, agile et irrésistiblement stylée, la Mini Cooper incarne un plaisir de conduite unique, entre héritage et modernité audacieuse.",
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
           AND (description IS NULL OR description = '')
         RETURNING id, marque, modele`,
        [description, marque, modele_like]
      );
      if (res.rows.length > 0) {
        res.rows.forEach(r => console.log(`✅ Mis à jour : #${r.id} ${r.marque} ${r.modele}`));
      } else {
        console.log(`ℹ️  Ignoré (description déjà présente ou véhicule introuvable) : ${marque} ${modele_like}`);
      }
    }
  } catch (err) {
    console.error('Erreur :', err.message);
  } finally {
    await pool.end();
  }
};

run();
