const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");
const validateRequest = require('../middlewares/validateRequest');

const messageValidation = [
	body('nom').trim().isLength({ min: 2, max: 80 }).withMessage('Nom requis'),
	body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
	body('sujet').trim().isLength({ min: 2, max: 120 }).withMessage('Sujet requis'),
	body('contenu').trim().isLength({ min: 10, max: 4000 }).withMessage('Message requis'),
];

// Envoyer un message de contact
router.post('/', messageValidation, validateRequest, contactController.sendMessage);

// Récupérer tous les messages (admin only)
router.get('/', authMiddleware, adminMiddleware, contactController.getAllMessages);

module.exports = router;