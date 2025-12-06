// middlewares/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  // Destination: où stocker les images
  destination: (req, file, cb) => {
    // Les images seront stockées dans public/uploads/vehicules/
    // Assurez-vous que ce chemin est correct par rapport à votre backend/app.js
    const dir = path.join(__dirname, '..', 'public', 'uploads', 'vehicules');

    // Crée le répertoire s'il n'existe pas
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },

  // Filename: comment nommer les fichiers
  filename: (req, file, cb) => {
    // Crée un nom de fichier unique et lisible : nom_original-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    
    cb(null, originalName + '-' + uniqueSuffix + extension);
  },
});

// --- 2. Configuration du Filtre (optionnel mais recommandé) ---
const fileFilter = (req, file, cb) => {
  // Accepte seulement les images (JPEG, PNG, GIF)
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter,
});

const uploadSingle = upload.single('image'); 
const uploadMultiple = upload.array('images', 10); 

module.exports = { uploadSingle, uploadMultiple };
