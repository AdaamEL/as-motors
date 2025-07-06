import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import "./registerPage.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nom: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext); // Utiliser le contexte pour connecter l'utilisateur
  const navigate = useNavigate();

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Réinitialiser les erreurs

    try {
      const response = await fetch("http://localhost:5432/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Envoi uniquement des champs nécessaires
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription. Veuillez vérifier vos informations.");
      }

      const data = await response.json();
      login(data); // Connecter l'utilisateur après l'inscription
      navigate("/"); // Rediriger vers la page d'accueil
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      console.error("Erreur :", err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input
            type="text"
            placeholder="Entrez votre nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <label>Email :</label>
          <input
            type="email"
            placeholder="Entrez votre email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <label>Mot de passe :</label>
          <input
            type="password"
            placeholder="Entrez votre mot de passe"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;