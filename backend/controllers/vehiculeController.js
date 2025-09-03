const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// === Helpers ===
const buildUrl = (req, vehiculeId, filename) =>
  `${req.protocol}://${req.get('host')}/uploads/${vehiculeId}/${filename}`;

const getVehiculeRow = async (id) => {
  const { rows } = await pool.query('SELECT * FROM vehicules WHERE id=$1', [id]);
  return rows[0] || null;
};

const getVehiculeImages = async (vehiculeId) => {
  const { rows } = await pool.query(
    'SELECT id, filename, position FROM vehicule_images WHERE vehicule_id=$1 ORDER BY position ASC',
    [vehiculeId]
  );
  return rows;
};

// === Public ===
exports.getVehicules = async (req, res) => {
  try {
    const { rows: vehs } = await pool.query('SELECT * FROM vehicules ORDER BY id DESC');
    if (!vehs.length) return res.json([]);

    const ids = vehs.map(v => v.id);
    const { rows: imgs } = await pool.query(
      'SELECT id, vehicule_id, filename, position FROM vehicule_images WHERE vehicule_id = ANY($1) ORDER BY vehicule_id, position',
      [ids]
    );

    const map = imgs.reduce((acc, r) => {
      (acc[r.vehicule_id] ||= []).push(r);
      return acc;
    }, {});

    const out = vehs.map(v => {
      const images = imgs.map(r => ({
        id: r.id,
        position: r.position,
        url: buildUrl(req, r.vehicule_id, r.filename),
      }));
      // Fallback si ancienne colonne image encore présente
      if (!images.length && v.image) {
        images.push({ id: null, position: 0, url: `/${v.image}` });
      }
      return { ...v, images };
    });

    res.json(out);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

exports.getVehiculeById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const v = await getVehiculeRow(id);
    if (!v) return res.status(404).json({ message: 'Not found' });

    const imgs = await getVehiculeImages(id);
    const images = imgs.map(r => ({
        id: r.id,
        position: r.position,
        url: buildUrl(req, r.vehicule_id, r.filename),
      }));
    if (!images.length && v.image) {
      images.push({ id: null, position: 0, url: `/${v.image}` });
    }
    res.json({ ...v, images });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching vehicle' });
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

// === Admin: Images ===
exports.addVehiculeImages = async (req, res) => {
  const vehiculeId = Number(req.params.id);
  const files = req.files || [];
  if (!vehiculeId) return res.status(400).json({ message: 'Vehicule id manquant' });
  if (!files.length) return res.status(400).json({ message: 'Aucun fichier' });

  try {
    const { rows } = await pool.query('SELECT COALESCE(MAX(position), -1) AS max FROM vehicule_images WHERE vehicule_id=$1', [vehiculeId]);
    let pos = rows[0].max + 1;

    const params = [];
    const values = [];
    files.forEach((f) => {
      params.push(vehiculeId, f.filename, pos++);
      values.push(`($${params.length-2}, $${params.length-1}, $${params.length})`);
    });

    await pool.query(
      `INSERT INTO vehicule_images (vehicule_id, filename, position) VALUES ${values.join(',')}`,
      params
    );

    res.status(201).json({ added: files.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur ajout images' });
  }
};

exports.deleteVehiculeImage = async (req, res) => {
  const vehiculeId = Number(req.params.id);
  const imageId = Number(req.params.imageId);
  try {
    const { rows } = await pool.query(
      'DELETE FROM vehicule_images WHERE id=$1 AND vehicule_id=$2 RETURNING filename',
      [imageId, vehiculeId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Image introuvable' });

    const filePath = path.join(uploadsDir, rows[0].filename);
    fs.promises.unlink(filePath).catch(() => {});
    res.json({ deleted: imageId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur suppression image' });
  }
};

exports.reorderVehiculeImages = async (req, res) => {
  const vehiculeId = Number(req.params.id);
  const order = req.body.order;
  if (!Array.isArray(order)) return res.status(400).json({ message: 'Order invalide' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < order.length; i++) {
      await client.query(
        'UPDATE vehicule_images SET position=$1 WHERE id=$2 AND vehicule_id=$3',
        [i, order[i], vehiculeId]
      );
    }
    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(e);
    res.status(500).json({ message: 'Erreur réordonnancement' });
  } finally {
    client.release();
  }
};
