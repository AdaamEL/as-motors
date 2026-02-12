const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const devisUpload = require('../middlewares/devisUpload');
const validateRequest = require('../middlewares/validateRequest');

const createReservationValidation = [
	body('vehicule_id').isInt({ min: 1 }).withMessage('vehicule_id invalide').toInt(),
	body('date_debut').isISO8601().withMessage('date_debut invalide'),
	body('date_fin').isISO8601().withMessage('date_fin invalide'),
	body('modele_cle').optional().isString().isLength({ max: 120 }).withMessage('modele_cle invalide'),
];

// Routes publiques
router.get("/pricing", reservationController.getPricing); // Grille de prix globale
router.get("/pricing/:id", reservationController.getPricingForVehicule); // Grille de prix par véhicule
router.get("/vehicule/:id/blocked", reservationController.getBlockedRanges); // Dates indisponibles

// Routes protégées pour les utilisateurs
router.post("/", authMiddleware, createReservationValidation, validateRequest, reservationController.createReservation); // Créer une réservation
router.get("/user", authMiddleware, reservationController.getMyReservations); // Récupérer les réservations de l'utilisateur connecté

// Routes admin
router.get("/", authMiddleware, adminMiddleware, reservationController.getAllReservations); // Toutes les réservations
router.patch("/:id", authMiddleware, adminMiddleware, reservationController.updateReservation); // Mettre à jour une réservation
router.post("/:id/devis", authMiddleware, adminMiddleware, devisUpload.single('devis'), reservationController.uploadDevis); // Upload devis
router.delete("/:id", authMiddleware, adminMiddleware, reservationController.deleteReservation); // Supprimer une réservation

module.exports = router;