const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadMultiple } = require('../middlewares/uploads');

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// === Multer: multi-fichiers ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const vehiculeId = req.params.id || req.body.vehicule_id;
    const dest = path.join(uploadsDir, String(vehiculeId));
    fs.mkdirSync(dest, { recursive: true }); // crée le dossier si nécessaire
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${unique}-${safeName}`);
  }
});

const allowed = new Set(['image/jpeg','image/png','image/webp']);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_, file, cb) => cb(allowed.has(file.mimetype) ? null : new Error('Invalid file type'), allowed.has(file.mimetype))
});

exports.uploadImages = upload.array('images', 8);

// === Public ===
exports.getVehicules = async (req, res) => {
    try {
        // Sélectionne toutes les colonnes nécessaires (sauf les chemins d'images inutiles)
        const result = await pool.query('SELECT * FROM vehicules');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des véhicules:", err.message);
        res.status(500).json({ msg: 'Erreur serveur.' });
    }
};

exports.getVehiculeById = async (req, res) => {
    const { id } = req.params;
    try {
        // Sélectionne toutes les colonnes nécessaires (sauf les chemins d'images inutiles)
        const query = `
            SELECT *
            FROM vehicules
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Véhicule non trouvé.' });
        }
        
        const vehicule = result.rows[0];

        res.status(200).json(vehicule);

    } catch (err) {
        console.error("Erreur lors de la récupération du véhicule:", err.message);
        res.status(500).json({ msg: 'Erreur serveur.' });
    }
};

exports.getReservationsForVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT date_debut, date_fin FROM reservations WHERE vehicule_id=$1',
      [id]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des plages réservées :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// === Admin: CRUD véhicule (hors images) ===
exports.createVehicle = async (req, res) => {
  try {
    const { marque, modele, annee, prix_jour, description } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO vehicules (marque, modele, annee, prix_jour, description) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [marque, modele, annee, prix_jour, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'ajout du véhicule :", err);
    res.status(500).json({ message: "Erreur lors de l'ajout du véhicule" });
  }
};

exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const fields = ['marque','modele','annee','prix_jour','description'];
  const sets = [];
  const params = [];
  let i = 1;
  fields.forEach((f) => {
    if (req.body[f] !== undefined) {
      sets.push(`${f}=$${i++}`);
      params.push(req.body[f]);
    }
  });
  if (!sets.length) return res.json({ updated: 0 });
  params.push(id);
  try {
    await pool.query(`UPDATE vehicules SET ${sets.join(', ')} WHERE id=$${i}`, params);
    res.json({ updated: 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur de mise à jour' });
  }
};

exports.deleteVehicle = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  try {
    // Récupère les fichiers pour nettoyage
    const { rows: files } = await client.query('SELECT filename FROM vehicule_images WHERE vehicule_id=$1', [id]);

    await client.query('BEGIN');
    await client.query('DELETE FROM vehicule_images WHERE vehicule_id=$1', [id]);
    await client.query('DELETE FROM vehicules WHERE id=$1', [id]);
    await client.query('COMMIT');

    files.forEach(f => fs.promises.unlink(path.join(uploadsDir, f.filename)).catch(() => {}));
    res.json({ deleted: 1 });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  } finally {
    client.release();
  }
};

