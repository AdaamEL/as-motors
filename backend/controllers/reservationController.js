const reservationModel = require('../models/reservationModel');
const { getVehiculeById } = require("../models/vehiculeModel");
const { getUserById } = require("../models/userModel");
const nodemailer = require("nodemailer");

// Créer une réservation
exports.createReservation = async (req, res) => {
  const userId = req.user.userId;
  const { vehicule_id, dateDebut, dateFin } = req.body;

  try {
    // ✅ Création en base
    const newReservation = await reservationModel.createReservation({
      userId,
      vehicule_id,
      dateDebut,
      dateFin,
    });

    // ✅ Récupérer les infos véhicule et user
    const vehicule = await getVehiculeById(vehicule_id);
    const user = await getUserById(userId);

    console.log("🚗 Vehicule ID:", vehicule_id);
console.log("📦 Vehicule reçu:", vehicule);
console.log("👤 User reçu:", user);
    // ✅ Préparer contenu de l'e-mail
    if (!vehicule || !user) {
      console.error("⚠️ Données incomplètes pour l'envoi de l'e-mail.");
    } else {
    const emailContent = `
🆕 Nouvelle réservation effectuée :

👤 Utilisateur :
- Nom : ${user.nom}
- Email : ${user.email}

🚗 Véhicule :
- ${vehicule.marque} ${vehicule.modele} (${vehicule.annee})
- Prix par jour : ${vehicule.prix_jour} €

📅 Réservation :
- Du : ${new Date(dateDebut).toLocaleDateString()}
- Au : ${new Date(dateFin).toLocaleDateString()}
- Statut : En attente
`;

    // ✅ Configuration Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Envoi
    await transporter.sendMail({
      from: `"AS Motors" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "Nouvelle réservation – AS Motors",
      text: emailContent,
    });
  }
    // ✅ Réponse client
    res.status(201).json(newReservation);
  } catch (err) {
    console.error("Erreur lors de la création de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la création de la réservation." });
  }
};

// Récupérer les réservations de l'utilisateur connecté
exports.getUserReservations = async (req, res) => {
  const userId = req.user.userId; // ✅ Assurez-vous que req.user contient userId

  try {
    const reservations = await reservationModel.getUserReservations(userId);
    res.status(200).json(reservations);
  } catch (err) {
    console.error("Erreur lors de la récupération des réservations :", err);
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
  const { dateDebut, dateFin, statut } = req.body;

  try {
    const updated = await reservationModel.updateReservation(id, { dateDebut, dateFin, statut });

    if (!updated) {
      return res.status(404).json({ message: "Réservation non trouvée." });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la réservation :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réservation." });
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM reservations WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Réservation introuvable." });
    }

    const reservation = result.rows[0];

    if (reservation.user_id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    await pool.query('DELETE FROM reservations WHERE id = $1', [id]);
    res.status(200).json({ message: "Réservation supprimée avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
