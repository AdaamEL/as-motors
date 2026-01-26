const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Routes protégées pour les utilisateurs
router.post("/", authMiddleware, reservationController.createReservation); // Créer une réservation
router.get("/user", authMiddleware, reservationController.getMyReservations); // Récupérer les réservations de l'utilisateur connecté


module.exports = router;