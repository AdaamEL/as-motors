const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Envoyer un message de contact
router.post('/', contactController.sendMessage);

// Récupérer tous les messages (admin only)
router.get('/', authMiddleware, adminMiddleware, contactController.getAllMessages);

module.exports = router;