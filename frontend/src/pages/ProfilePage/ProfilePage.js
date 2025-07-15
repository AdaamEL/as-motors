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
    mot_de_passe: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !user) navigate("/login");
    if (user) {
      setFormData({
        nom: user.nom,
        email: user.email,
        mot_de_passe: "",
      });
    }
  }, [isLoading, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const confirmChange = window.confirm("Confirmez-vous la modification ?");
    if (!confirmChange) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour.");
      }

      setMessage("Profil mis à jour avec succès !");
    } catch (err) {
      setError(err.message || "Erreur de mise à jour.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Mon Profil</h1>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />

          <label>Email :</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Nouveau mot de passe :</label>
          <input type="password" name="mot_de_passe" value={formData.mot_de_passe} onChange={handleChange} />

          <button type="submit">Mettre à jour</button>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
