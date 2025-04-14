const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Enregistrer un utilisateur
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.registerUser(email, password);
    res.status(201).json({ message: 'Utilisateur enregistré' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement' });
  }
};

// Connecter un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.loginUser(email);
    if (!user || !(await bcrypt.compare(password, user.mot_de_passe))) {
      return res.status(400).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
