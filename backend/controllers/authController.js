// as-motors/backend/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const normalizeEmail = (e) => String(e || '').trim().toLowerCase();
const sanitize = (s) => String(s || '').trim();

// ------------------------- REGISTER -------------------------
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0]?.msg || 'Données invalides.' });

  try {
    const { nom, prenom, email, password, consent } = req.body;
    const _nom = sanitize(nom);
    const _prenom = sanitize(prenom);
    const _email = normalizeEmail(email);
    const _password = String(password || '');

    if (!_nom || !_prenom) return res.status(400).json({ message: 'Nom et prénom requis.' });
    if (!_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email))
      return res.status(400).json({ message: 'Email invalide.' });
    if (_password.length < 12 || !/[A-Z]/.test(_password) || !/[a-z]/.test(_password) || !/\d/.test(_password) || !/[^A-Za-z0-9]/.test(_password)) {
      return res.status(400).json({ message: 'Le mot de passe ne respecte pas les critères.' });
    }
    if (!(consent === true || consent === 'true'))
      return res.status(400).json({ message: 'Le consentement est requis.' });

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [_email]);
    if (exists.rows.length) return res.status(409).json({ message: 'Cet email est déjà utilisé.' });

    const hash = await bcrypt.hash(_password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (nom, prenom, email, mot_de_passe, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, nom, prenom, email, role`,
      [_nom, _prenom, _email, hash]
    );

    res.status(201).json({ user: rows[0] });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ------------------------- LOGIN -------------------------
exports.login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const { rows } = await pool.query(
      'SELECT id, nom, prenom, email, mot_de_passe, role FROM users WHERE email=$1',
      [email]
    );
    if (!rows.length) return res.status(401).json({ message: 'Identifiants invalides' });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.mot_de_passe);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    delete user.mot_de_passe;
    res.json({ token, user });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ message: 'Erreur serveur' });
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