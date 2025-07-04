const pool = require('../config/db');

// Récupérer tous les messages de contact
exports.getContacts = async () => {
  const result = await pool.query('SELECT * FROM contacts');
  return result.rows;
};

// Créer un nouveau message de contact
exports.createContact = async (contact) => {
  const { nom, email, message } = contact;
  const result = await pool.query(
    'INSERT INTO contacts (nom, email, message) VALUES ($1, $2, $3) RETURNING *',
    [nom, email, message]
  );
  return result.rows[0];
};

// Envoyer un message de contact
exports.sendMessage = async ({ nom, email, sujet, contenu }) => {
  await pool.query(
    'INSERT INTO messages (nom, email, sujet, contenu, date_envoi) VALUES ($1, $2, $3, $4, NOW())',
    [nom, email, sujet, contenu]
  );
};