import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../services/authContext";
import { useNavigate } from "react-router-dom";
import "./profilePage.css";

const ProfilePage = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom,
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmChange = window.confirm(
      "Êtes-vous sûr de vouloir modifier vos informations ?"
    );

    if (!confirmChange) return;

    try {
      const response = await fetch(`http://localhost:5432/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des informations.");
      }

      setMessage("Vos informations ont été mises à jour avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>; // Affiche un message de chargement pendant que les données utilisateur sont récupérées
  }

  if (!user) {
    return null; // Empêche le rendu si l'utilisateur n'est pas défini
  }

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <label>Nom :</label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
          <label>Email :</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <label>Mot de passe :</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Laissez vide pour ne pas changer"
          />
          <button type="submit" className="btn-primary">Modifier</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;