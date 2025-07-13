const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis les en-têtes de la requête
  const token = req.headers.authorization?.split(" ")[1]; // Format attendu : "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé. Token manquant." });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter les informations utilisateur à l'objet req
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    // Passer au middleware ou contrôleur suivant
    next();
  } catch (err) {
    console.error("Erreur lors de la vérification du token :", err);
    return res.status(403).json({ message: "Token invalide ou expiré." });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès réservé aux administrateurs." });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };