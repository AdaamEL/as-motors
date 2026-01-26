// as-motors/backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const normalizeEmail = (e) => String(e || '').trim().toLowerCase();
const sanitize = (s) => String(s || '').trim();

// ------------------------- REGISTER -------------------------
exports.register = async (req, res) => {
  try {
    // On récupère TOUS les champs du formulaire
    const { nom, prenom, email, password, telephone, adresse, numero_permis } = req.body;

    // Vérif email existant
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    // Hashage
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Création (role 'client' par défaut)
    const newUser = await userModel.createUser({
      nom, prenom, email, password_hash, role: 'client', telephone, adresse, numero_permis
    });

    res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ------------------------- LOGIN -------------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

// ------------------------- ME (profil courant) -------------------------
exports.me = async (req, res) => {
  try {
    const userId = req.user?.id; // 🔧 cohérent avec authMiddleware
    if (!userId) return res.status(401).json({ message: 'Non autorisé' });

    const { rows } = await pool.query(
      'SELECT id, nom, prenom, email, role FROM users WHERE id = $1',
      [userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable' });

    return res.json(rows[0]);
  } catch (e) {
    console.error('Me error:', e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ------------------------- GET ALL USERS (ADMIN) -------------------------
exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, nom, prenom, email, role FROM users ORDER BY id DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error('getAllUsers error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ------------------------- DELETE USER (ADMIN) -------------------------
exports.deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ message: "ID utilisateur invalide." });

    // On peut empêcher la suppression de soi-même si voulu :
    // if (req.user.id === userId) return res.status(400).json({ message: "Impossible de supprimer votre propre compte." });

    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    if (!rowCount) return res.status(404).json({ message: "Utilisateur introuvable." });

    res.json({ deleted: userId });
  } catch (e) {
    console.error('deleteUser error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


