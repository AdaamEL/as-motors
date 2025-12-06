const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { uploadMultiple } = require('../middlewares/uploads');

// Public
router.get('/', vehiculeController.getVehicules);
router.get('/:id', vehiculeController.getVehiculeById);
router.get('/:id/reservations', authMiddleware, adminMiddleware, vehiculeController.getReservationsForVehicle);

// Admin CRUD véhicule (sans images)
router.post('/', authMiddleware, adminMiddleware, vehiculeController.createVehicle);
router.put('/:id', authMiddleware, adminMiddleware, vehiculeController.updateVehicle);
router.delete('/:id', authMiddleware, adminMiddleware, vehiculeController.deleteVehicle);

module.exports = router;
