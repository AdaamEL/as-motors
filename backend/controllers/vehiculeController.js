const vehiculeModel = require('../models/vehiculeModel');
const multer = require('multer');
const path = require('path');

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
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
  upload.single('image'), // Middleware multer
  async (req, res) => {
    try {
      const { marque, modele, annee, prix_jour, disponible } = req.body;
      const image = req.file ? `uploads/${req.file.filename}` : 'uploads/default.jpg';

      const vehicule = await vehiculeModel.createVehicle({
        marque,
        modele,
        annee,
        prix_jour,
        image,
        disponible: disponible === 'true', // Convertir en boolean
      });

      res.status(201).json(vehicule);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du véhicule :', err);
      res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule' });
    }
  },
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
  const { marque, modele, annee, immatriculation, prix_jour, disponible, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE vehicules SET marque = $1, modele = $2, annee = $3, immatriculation = $4, prix_jour = $5, disponible = $6, description = $7 WHERE id = $8 RETURNING *",
      [marque, modele, annee, immatriculation, prix_jour, disponible, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Véhicule non trouvé." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du véhicule :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du véhicule." });
  }
};