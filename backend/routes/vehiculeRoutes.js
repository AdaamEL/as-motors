const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Récupérer tous les véhicules
router.get('/', vehiculeController.getVehicules);
router.get("/:id", vehiculeController.getVehiculeById);

router.get('/:id/reservations', vehiculeController.getReservationsForVehicle);

// Routes protégées pour les administrateurs
router.post("/", authMiddleware, adminMiddleware, vehiculeController.createVehicle); // Ajouter un véhicule
router.put("/:id", authMiddleware, adminMiddleware, vehiculeController.updateVehicle); // Modifier un véhicule
router.delete("/:id", authMiddleware, adminMiddleware, vehiculeController.deleteVehicle); // Supprimer un véhicule

module.exports = router;
