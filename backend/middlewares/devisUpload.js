const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const baseUploadPath = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
const devisDir = path.join(baseUploadPath, 'devis');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(devisDir, { recursive: true });
    cb(null, devisDir);
  },
  filename: (req, file, cb) => {
    const id = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `${Date.now()}-${id}${ext}`);
  },
});

const allowed = new Set([
  'application/pdf',
  'application/x-pdf',
  'application/acrobat',
  'applications/vnd.pdf',
  'text/pdf',
  'text/x-pdf',
]);

const devisUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_, file, cb) => {
    if (!allowed.has(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
});

module.exports = devisUpload;
