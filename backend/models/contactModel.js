const pool = require('../config/db');

// Récupérer tous les messages
exports.getMessages = async () => {
  const result = await pool.query('SELECT * FROM messages ORDER BY date_envoi DESC');
  return result.rows;
};

// Alias pour getAllMessages (utilisé par le contrôleur admin)
exports.getAllMessages = async () => {
  const result = await pool.query('SELECT * FROM messages ORDER BY date_envoi DESC');
  return result.rows;
};

// Enregistrer un nouveau message
exports.sendMessage = async ({ nom, email, sujet, contenu }) => {
  const result = await pool.query(
    'INSERT INTO messages (nom, email, sujet, contenu, date_envoi) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
    [nom, email, sujet, contenu]
  );
  return result.rows[0];
};
