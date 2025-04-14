const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Initialiser Express
const app = express();

// Middlewares
app.use(cors()); // Activer CORS
app.use(express.json()); // Permettre la réception de JSON dans les requêtes
app.use(express.urlencoded({ extended: true })); // Permettre la réception de données URL-encoded

// Routes
const vehiculeRoutes = require('./routes/vehiculeRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
