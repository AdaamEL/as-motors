const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require("../middlewares/authMiddleware");

// Enregistrer un utilisateur
router.post('/register', authController.register);

// Connecter un utilisateur
router.post('/login', authController.login);

// Récupérer tous les utilisateurs
router.get('/users', authMiddleware, authController.getAllUsers);

router.put("/update-profile", authMiddleware, authController.updateProfile);

// Supprimer un utilisateur
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;
