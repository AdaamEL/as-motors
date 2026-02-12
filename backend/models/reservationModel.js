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

const getAllReservations = async () => {
    const query = `
        SELECT r.id, r.user_id, r.vehicule_id, r.date_debut, r.date_fin, r.montant_total, r.statut, r.date_creation,
               r.devis_path, r.devis_uploaded_at,
               u.nom as user_nom, u.prenom as user_prenom, u.email,
               v.marque as vehicule_marque
        FROM reservations r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN vehicules v ON r.vehicule_id = v.id
        ORDER BY r.date_creation DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

const updateReservation = async (id, data) => {
    const { status } = data;
    const query = `
        UPDATE reservations 
        SET statut = $1
        WHERE id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
};

const deleteReservation = async (id) => {
    const query = `DELETE FROM reservations WHERE id = $1 RETURNING id`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getReservationById = async (id) => {
    const query = `
        SELECT r.*
        FROM reservations r
        WHERE r.id = $1
        LIMIT 1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const updateReservationDevis = async (id, devisPath) => {
    const query = `
        UPDATE reservations
        SET devis_path = $1, devis_uploaded_at = NOW()
        WHERE id = $2
        RETURNING *
    `;
    const result = await pool.query(query, [devisPath, id]);
    return result.rows[0];
};

const getBlockedRangesByVehicule = async (vehiculeId) => {
    const query = `
        SELECT date_debut, date_fin
        FROM reservations
        WHERE vehicule_id = $1
        AND statut != 'annulée'
        ORDER BY date_debut ASC
    `;
    const result = await pool.query(query, [vehiculeId]);
    return result.rows;
};

module.exports = { createReservation, getReservationsByUser, checkAvailability, getAllReservations, updateReservation, deleteReservation, getReservationById, updateReservationDevis, getBlockedRangesByVehicule };