const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Public
router.get('/', vehiculeController.getVehicules);
router.get('/:id', vehiculeController.getVehiculeById);
router.get('/:id/reservations', vehiculeController.getReservationsForVehicle);

// Admin CRUD véhicule (sans images)
router.post('/', authMiddleware, adminMiddleware, vehiculeController.createVehicle);
router.put('/:id', authMiddleware, adminMiddleware, vehiculeController.updateVehicle);
router.delete('/:id', authMiddleware, adminMiddleware, vehiculeController.deleteVehicle);

// NEW: Images (multi)
router.post('/:id/images', authMiddleware, adminMiddleware, vehiculeController.uploadImages, vehiculeController.addVehiculeImages);
router.delete('/:id/images/:imageId', authMiddleware, adminMiddleware, vehiculeController.deleteVehiculeImage);
router.put('/:id/images/order', authMiddleware, adminMiddleware, vehiculeController.reorderVehiculeImages);

module.exports = router;
