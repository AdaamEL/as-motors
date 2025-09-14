const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require("../middlewares/authMiddleware");

// Validations d’inscription (express-validator)
const registerValidation = [
  body('nom').trim().isLength({ min: 1, max: 80 }).withMessage('Nom requis'),
  body('prenom').trim().isLength({ min: 1, max: 80 }).withMessage('Prénom requis'),
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password')
    .isLength({ min: 12 }).withMessage('12 caractères minimum')
    .matches(/[A-Z]/).withMessage('Une majuscule requise')
    .matches(/[a-z]/).withMessage('Une minuscule requise')
    .matches(/\d/).withMessage('Un chiffre requis')
    .matches(/[^A-Za-z0-9]/).withMessage('Un caractère spécial requis'),
  body('consent').custom(v => v === true || v === 'true').withMessage('Consentement requis'),
];

// Validations de login (sobres)
const loginValidation = [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 1 }).withMessage('Mot de passe requis'),
];

router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Récupérer tous les utilisateurs
router.get('/users', authMiddleware, authController.getAllUsers);
router.get("/me", authMiddleware, authController.getMe);

router.put("/update-profile", authMiddleware, authController.updateProfile);

// Supprimer un utilisateur
router.delete("/users/:id", authMiddleware, authController.deleteUser);

module.exports = router;
