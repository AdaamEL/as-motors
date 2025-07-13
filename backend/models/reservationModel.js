const pool = require('../config/db');

// Créer une réservation
exports.createReservation = async (reservation) => {
  const { userId, vehiculeId, dateDebut, dateFin } = reservation;

  const result = await pool.query(
    `INSERT INTO reservations (user_id, vehicule_id, date_debut, date_fin) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, vehiculeId, dateDebut, dateFin]
  );

  return result.rows[0];
};

// Récupérer les réservations d'un utilisateur
exports.getUserReservations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const reservations = await reservationModel.getUserReservations(userId);
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async () => {
  const result = await pool.query('SELECT * FROM reservations');
  return result.rows;
};

// Mettre à jour une réservation (champs partiels)
exports.updateReservation = async (id, data) => {
  const { dateDebut, dateFin, statut } = data;

  if (dateDebut) {
    await pool.query(
      "UPDATE reservations SET date_debut = $1 WHERE id = $2",
      [dateDebut, id]
    );
  }

  if (dateFin) {
    await pool.query(
      "UPDATE reservations SET date_fin = $1 WHERE id = $2",
      [dateFin, id]
    );
  }

  if (statut) {
    await pool.query(
      "UPDATE reservations SET statut = $1 WHERE id = $2",
      [statut, id]
    );
  }

  const result = await pool.query("SELECT * FROM reservations WHERE id = $1", [id]);
  return result.rows[0];
};

// Supprimer une réservation
exports.deleteReservation = async (id) => {
  await pool.query("DELETE FROM reservations WHERE id = $1", [id]);
};
