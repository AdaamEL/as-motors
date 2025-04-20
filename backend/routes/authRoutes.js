const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Enregistrer un utilisateur
router.post('/register', authController.register);

// Connecter un utilisateur
router.post('/login', authController.login);

// Récupérer tous les utilisateurs
router.get('/users', authController.getAllUsers);

//router.put("/update-profile", authMiddleware, authController.updateProfile);

module.exports = router;
