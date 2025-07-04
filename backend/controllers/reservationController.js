const reservationModel = require('../models/reservationModel');

// Créer une réservation
exports.createReservation = async (req, res) => {
  const { userId, vehiculeId, dateDebut, dateFin } = req.body;

  try {
    const newReservation = await reservationModel.createReservation({
      userId,
      vehiculeId,
      dateDebut,
      dateFin,
    });
    res.status(201).json(newReservation);
  } catch (err) {
    console.error("Erreur lors de la création de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la création de la réservation." });
  }
};

// Récupérer les réservations de l'utilisateur connecté
exports.getUserReservations = async (req, res) => {
  const userId = req.user.id; // Assurez-vous que l'ID utilisateur est disponible dans `req.user`

  try {
    const reservations = await reservationModel.getUserReservations(userId);
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
  }
};

// Récupérer toutes les réservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await reservationModel.getAllReservations();
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des réservations." });
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  try {
    await reservationModel.updateReservation(id, statut);
    res.status(200).json({ message: "Réservation mise à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réservation." });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    await reservationModel.deleteReservation(id);
    res.status(200).json({ message: "Réservation supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la suppression de la réservation." });
  }
};