const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');

// Récupérer tous les véhicules
router.get('/', vehiculeController.getVehicules);

// Récupérer un véhicule par ID
router.get('/:id', vehiculeController.getVehiculeById);

// Ajouter un véhicule
router.post('/', vehiculeController.addVehicule);

module.exports = router;
