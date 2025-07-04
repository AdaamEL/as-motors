const pool = require('../config/db');

// Récupérer tous les véhicules
const getVehicules = async () => {
  const result = await pool.query('SELECT * FROM voitures');
  return result.rows;
};

// Récupérer un véhicule par ID
const getVehiculeById = async (id) => {
  const result = await pool.query('SELECT * FROM voitures WHERE id = $1', [id]);
  return result.rows[0];
};

// Ajouter un véhicule
const createVehicle = async (vehicule) => {
  const { marque, modele, annee, prix_jour, image, disponible } = vehicule;
  const result = await pool.query(
    'INSERT INTO vehicules (marque, modele, annee, prix_jour, image, disponible) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [marque, modele, annee, prix_jour, image, disponible]
  );
  return result.rows[0];
};

module.exports = {
  getVehicules,
  getVehiculeById,
  createVehicle,
};
