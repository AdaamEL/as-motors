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
exports.addVehicule = [
    upload.single('image'),
    async (req, res) => {
      try {
        const { marque, modele, annee, immatriculation, prix_jour, disponible, description } = req.body;
        const image = req.file ? `uploads/${req.file.filename}` : 'uploads/default.jpg';
  
        console.log('Données reçues :', { marque, modele, annee, immatriculation, prix_jour, disponible, description, image });
  
        const vehicule = await vehiculeModel.addVehicule({
          marque,
          modele,
          annee,
          immatriculation,
          prix_jour,
          image,
          disponible: disponible === 'true' ? true : false, // Convertir en boolean
          description,
        });
  
        res.status(201).json(vehicule);
      } catch (err) {
        console.error('Erreur lors de l\'ajout du véhicule :', err);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du véhicule' });
      }
    },
  ];