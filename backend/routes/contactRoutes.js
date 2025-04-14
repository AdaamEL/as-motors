const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Envoyer un message de contact
router.post('/', contactController.sendMessage);

module.exports = router;
