const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Enregistrer un utilisateur
const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (email, mot_de_passe, role) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, 'user']
  );
  return result.rows[0];
};

// Vérifier les identifiants d'un utilisateur
const loginUser = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

module.exports = {
  registerUser,
  loginUser,
};
