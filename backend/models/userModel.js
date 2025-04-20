const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Enregistrer un utilisateur
const registerUser = async (nom, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (nom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [nom, email, hashedPassword, 'user'] // Ajout du champ nom
  );
  return result.rows[0];
};

// Vérifier les identifiants d'un utilisateur
const loginUser = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Récupérer tous les utilisateurs
const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
};