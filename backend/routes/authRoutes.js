const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Enregistrer un utilisateur
router.post('/register', authController.register);

// Connecter un utilisateur
router.post('/login', authController.login);

module.exports = router;
