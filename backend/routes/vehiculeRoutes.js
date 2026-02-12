const express = require('express');
const router = express.Router();
const vehiculeController = require('../controllers/vehiculeController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const { uploadMultiple } = require('../middlewares/uploads');

// Public
router.get('/', vehiculeController.getAllVehicules);
router.get('/:id', vehiculeController.getVehiculeById);

// Admin CRUD véhicule (sans images)
router.post('/', authMiddleware, adminMiddleware, vehiculeController.createVehicule);

module.exports = router;
