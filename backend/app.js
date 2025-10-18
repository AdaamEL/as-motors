const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('./config/db');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// NEW: servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// (tes imports de routes)
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use('/vehicules', vehiculeRoutes);
app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/reservations', reservationRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
