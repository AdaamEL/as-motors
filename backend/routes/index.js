const express = require('express');
const router = express.Router();

const vehiculeRoutes = require('./vehiculeRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');
const reservationRoutes = require('./reservationRoutes');

router.use('/vehicules', vehiculeRoutes);
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
router.use('/reservations', reservationRoutes);

module.exports = router;
