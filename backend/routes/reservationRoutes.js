const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Routes protégées pour les utilisateurs
router.post("/", authMiddleware, reservationController.createReservation); // Créer une réservation
router.get("/user", authMiddleware, reservationController.getUserReservations); // Récupérer les réservations de l'utilisateur connecté

// Routes protégées pour les administrateurs
router.get("/", authMiddleware, adminMiddleware, reservationController.getAllReservations); // Récupérer toutes les réservations
router.put("/:id", authMiddleware, adminMiddleware, reservationController.updateReservation); // Mettre à jour une réservation
router.delete("/:id", authMiddleware, adminMiddleware, reservationController.deleteReservation); // Supprimer une réservation

module.exports = router;