const pool = require('../config/db');

const getAllVehicules = async () => {
    const result = await pool.query('SELECT * FROM vehicules ORDER BY id ASC');
    return result.rows;
};

const getVehiculeById = async (id) => {
    const result = await pool.query('SELECT * FROM vehicules WHERE id = $1', [id]);
    return result.rows[0];
};

const createVehicule = async (vehicule) => {
    const { 
        marque, modele, annee, immatriculation, type_boite, 
        carburant, places, prix_base_journalier, image_url, description 
    } = vehicule;

    const query = `
        INSERT INTO vehicules (
            marque, modele, annee, immatriculation, type_boite, 
            carburant, places, prix_base_journalier, image_url, description
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING *
    `;
    
    const values = [
        marque, modele, annee, immatriculation, type_boite, 
        carburant, places, prix_base_journalier, image_url, description
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};

module.exports = {
    getAllVehicules,
    getVehiculeById,
    createVehicule
};