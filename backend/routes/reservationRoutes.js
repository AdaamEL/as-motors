const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// Récupérer toutes les réservations
router.get('/', reservationController.getAllReservations);

module.exports = router;