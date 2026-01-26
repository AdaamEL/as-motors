const pool = require('../config/db');

const createReservation = async (data) => {
    const { user_id, vehicule_id, date_debut, date_fin, montant_total, statut } = data;
    const query = `
        INSERT INTO reservations (user_id, vehicule_id, date_debut, date_fin, montant_total, statut)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    const values = [user_id, vehicule_id, date_debut, date_fin, montant_total, statut];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getReservationsByUser = async (userId) => {
    const query = `
        SELECT r.*, v.marque, v.modele 
        FROM reservations r
        JOIN vehicules v ON r.vehicule_id = v.id
        WHERE r.user_id = $1
        ORDER BY r.date_creation DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};

const checkAvailability = async (vehiculeId, dateDebut, dateFin) => {
    // Logique SQL : On cherche une réservation qui CHEVAUCHE les dates demandées
    // et qui n'est pas annulée.
    const query = `
        SELECT * FROM reservations 
        WHERE vehicule_id = $1 
        AND statut != 'annulée'
        AND (
            (date_debut <= $3 AND date_fin >= $2) -- Chevauchement classique
        )
    `;
    const result = await pool.query(query, [vehiculeId, dateDebut, dateFin]);
    
    // Si on trouve une ligne, c'est que c'est PAS disponible (return false)
    return result.rows.length === 0; 
};

module.exports = { createReservation, getReservationsByUser, checkAvailability };