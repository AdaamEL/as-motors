const pool = require('../config/db');

// Envoyer un message de contact
exports.sendMessage = async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  try {
    await pool.query(
      'INSERT INTO messages (nom, email, sujet, contenu, date_envoi) VALUES ($1, $2, $3, $4, NOW())',
      [nom, email, sujet, contenu]
    );
    res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};
