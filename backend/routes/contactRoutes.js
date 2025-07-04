const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

// Envoyer un message de contact
router.post('/', contactController.sendMessage);

module.exports = router;