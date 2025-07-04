const contactModel = require('../models/contactModel');

// Récupérer tous les messages de contact
exports.getContacts = async (req, res) => {
  try {
    const contacts = await contactModel.getContacts();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Erreur lors de la récupération des contacts :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouveau message de contact
exports.createContact = async (req, res) => {
  const { nom, email, message } = req.body;

  try {
    const newContact = await contactModel.createContact({ nom, email, message });
    res.status(201).json(newContact);
  } catch (err) {
    console.error('Erreur lors de la création du contact :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Envoyer un message de contact
exports.sendMessage = async (req, res) => {
  const { nom, email, sujet, contenu } = req.body;

  try {
    await contactModel.sendMessage({ nom, email, sujet, contenu });
    res.json({ message: 'Message envoyé avec succès' });
  } catch (err) {
    console.error('Erreur lors de l\'envoi du message :', err);
    res.status(500).json({ message: 'Erreur lors de l\'envoi du message' });
  }
};