const pool = require('../config/db');

// Créer une réservation
exports.createReservation = async (reservation) => {
  const { userId, vehiculeId, dateDebut, dateFin } = reservation;

  const result = await pool.query(
    'INSERT INTO reservations (user_id, vehicule_id, date_debut, date_fin) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, vehiculeId, dateDebut, dateFin]
  );

  return result.rows[0];
};

// Récupérer les réservations d'un utilisateur
exports.getUserReservations = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM reservations WHERE user_id = $1',
    [userId]
  );
  return result.rows;
};

// Récupérer toutes les réservations
exports.getAllReservations = async () => {
  const result = await pool.query('SELECT * FROM reservations');
  return result.rows;
};

// Mettre à jour une réservation
exports.updateReservation = async (id, statut) => {
  await pool.query(
    'UPDATE reservations SET statut = $1 WHERE id = $2',
    [statut, id]
  );
};

// Supprimer une réservation
exports.deleteReservation = async (id) => {
  await pool.query(
    'DELETE FROM reservations WHERE id = $1',
    [id]
  );
};