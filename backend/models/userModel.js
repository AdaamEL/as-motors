const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Enregistrer un utilisateur
const createUser = async (userData) => {
  const { nom, prenom, email, password_hash, role, telephone, adresse, numero_permis } = userData;
  
  const query = `
    INSERT INTO users (nom, prenom, email, password_hash, role, telephone, adresse, numero_permis)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, nom, prenom, email, role;
  `;
  
  const values = [nom, prenom, email, password_hash, role || 'client', telephone, adresse, numero_permis];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
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

const getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  findUserByEmail
};