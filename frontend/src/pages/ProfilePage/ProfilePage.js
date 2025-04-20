import React, { useContext, useState } from "react";
import { AuthContext } from "../../services/authContext";
import "./profilePage.css";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nom: user.nom,
    email: user.email,
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmChange = window.confirm(
      "Êtes-vous sûr de vouloir modifier vos informations ?"
    );

    if (!confirmChange) return;

    try {
      const response = await fetch(`http://localhost:5000/api/auth/update-profile`, {
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

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
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
        <button type="submit" className="btn-primary">Modifier</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ProfilePage;