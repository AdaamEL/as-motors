const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Enregistrer un utilisateur
exports.register = async (req, res) => {
  const { nom, email, password } = req.body; // Ajout du champ nom

  try {
    const existingUser = await userModel.loginUser(email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Enregistrer l'utilisateur
    const user = await userModel.registerUser(nom, email, password); // Passer le champ nom
    res.status(201).json({ message: "Utilisateur enregistré avec succès", user });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err); // Log de l'erreur
    res.status(500).json({ message: "Erreur lors de l'enregistrement" });
  }
};

// Connecter un utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await userModel.loginUser(email);
    if (!user) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email ou mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retourner le token et les informations utilisateur
    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erreur lors de la connexion :", err);
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

exports.updateProfile = async (req, res) => {
  const { userId } = req.user; // Récupérer l'ID de l'utilisateur depuis le token
  const { nom, email } = req.body;

  try {
    await pool.query(
      "UPDATE users SET nom = $1, email = $2 WHERE id = $3",
      [nom, email, userId]
    );
    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};