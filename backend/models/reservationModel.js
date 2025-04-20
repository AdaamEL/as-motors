const pool = require('../config/db');

// Récupérer toutes les réservations
const getAllReservations = async () => {
  const result = await pool.query('SELECT * FROM reservations');
  return result.rows;
};

module.exports = {
  getAllReservations,
};