const express = require('express');
const router = express.Router();

const vehiculeRoutes = require('./vehiculeRoutes');
const authRoutes = require('./authRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/vehicules', vehiculeRoutes);
router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
