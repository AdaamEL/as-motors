const vehiculeModel = require('../models/vehiculeModel');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');

// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Récupérer tous les véhicules
exports.getVehicules = async (req, res) => {
  try {
    const vehicules = await vehiculeModel.getVehicules();
    res.json(vehicules);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un véhicule par ID
exports.getVehiculeById = async (req, res) => {
  try {
    const vehicule = await vehiculeModel.getVehiculeById(req.params.id);
    if (!vehicule) {
      return res.status(404).json({ message: 'Véhicule non trouvé' });
    }
    res.json(vehicule);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un véhicule avec upload d'image
exports.createVehicle = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { marque, modele, annee, prix_jour } = req.body;
      const image = req.file ? `uploads/${req.file.filename}` : 'uploads/default.jpg';

      const vehicule = await vehiculeModel.createVehicle({
        marque,
        modele,
        annee,
        prix_jour,
        image
      });

      res.status(201).json(vehicule);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du véhicule :', err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule' });
    }
  }
];

// Supprimer un véhicule
exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM vehicules WHERE id = $1", [id]);
    res.status(200).json({ message: "Véhicule supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du véhicule :", err);
    res.status(500).json({ message: "Erreur lors de la suppression du véhicule." });
  }
};

// Mettre à jour un véhicule
exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { marque, modele, annee, prix_jour } = req.body;

  try {
    // Mettre à jour uniquement les champs fournis
    if (marque) {
      await pool.query("UPDATE vehicules SET marque = $1 WHERE id = $2", [marque, id]);
    }

    if (modele) {
      await pool.query("UPDATE vehicules SET modele = $1 WHERE id = $2", [modele, id]);
    }

    if (annee) {
      await pool.query("UPDATE vehicules SET annee = $1 WHERE id = $2", [annee, id]);
    }

    if (prix_jour) {
      await pool.query("UPDATE vehicules SET prix_jour = $1 WHERE id = $2", [prix_jour, id]);
    }

    // Récupérer et retourner le véhicule mis à jour
    const result = await pool.query("SELECT * FROM vehicules WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Véhicule non trouvé." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du véhicule :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du véhicule." });
  }
};


// Obtenir les réservations d’un véhicule (plages utilisées dans le calendrier)
exports.getReservationsForVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT date_debut, date_fin 
       FROM reservations 
       WHERE vehicule_id = $1`,
      [id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des plages réservées :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
