const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Enregistrer un utilisateur
exports.register = async (req, res) => {
  const { nom, email, password } = req.body; 

  try {
    const existingUser = await userModel.loginUser(email);
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Enregistrer l'utilisateur
    const user = await userModel.registerUser(nom, email, password); 
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
  const { userId } = req.user;
  const { nom, email, password } = req.body;

  try {
    console.log("Données reçues :", { userId, nom, email, password });
    if (nom) {
      await pool.query("UPDATE users SET nom = $1 WHERE id = $2", [nom, userId]);
    }
    
    if (email) {
      await pool.query("UPDATE users SET email = $1 WHERE id = $2", [email, userId]);
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query("UPDATE users SET mot_de_passe = $1 WHERE id = $2", [hashedPassword, userId]);
    }

    res.status(200).json({ message: "Profil mis à jour avec succès." });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil :", err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil." });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};

exports.getMe = async (req, res) => {
  const { userId } = req.user;
  try {
    const result = await pool.query("SELECT id, nom, email, role FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération de l'utilisateur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};