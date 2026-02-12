const vehiculeModel = require('../models/vehiculeModel');

const getAllVehicules = async (req, res) => {
    try {
        const vehicules = await vehiculeModel.getAllVehicules();
        res.json(vehicules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des véhicules' });
    }
};

const createVehicule = async (req, res) => {
    try {
        // Pour ton format d'image, on stocke juste la "clé" (ex: clio-alpine)
        // L'image_url en DB servira de base pour le dossier
        const vehicule = await vehiculeModel.createVehicule(req.body);
        res.status(201).json(vehicule);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVehiculeById = async (req, res) => {
    try {
        const vehicule = await vehiculeModel.getVehiculeById(req.params.id);
        if (vehicule) {
            res.json(vehicule);
        } else {
            res.status(404).json({ message: 'Véhicule non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllVehicules,
    createVehicule,
    getVehiculeById
};
