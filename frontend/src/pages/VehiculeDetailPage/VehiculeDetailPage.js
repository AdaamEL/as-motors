import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import "../VehiculeDetailPage/VehiculeDetailPage.css";

const VehiculeDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [vehicule, setVehicule] = useState(null);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/vehicules/${id}`);
        const data = await response.json();
        setVehicule(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du véhicule :", error);
      }
    };

    fetchVehicule();
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!dateDebut || !dateFin) {
      setMessage("Veuillez renseigner les deux dates.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicule_id: id,
          date_debut: dateDebut,
          date_fin: dateFin,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Erreur de réservation");

      setMessage("Réservation envoyée avec succès !");
    } catch (error) {
      console.error("Erreur réservation :", error);
      setMessage(error.message || "Erreur lors de la réservation.");
    }
  };

  if (!vehicule) return <p>Chargement en cours...</p>;

  return (
    <div className="vehicule-detail">
      <h1>{vehicule.marque} {vehicule.modele}</h1>
      <img src={vehicule.image} alt={`${vehicule.marque} ${vehicule.modele}`} />
      <p><strong>Prix par jour :</strong> {vehicule.prix_jour} €</p>
      <p><strong>Année :</strong> {vehicule.annee}</p>

      {isAuthenticated ? (
        <form className="reservation-form" onSubmit={handleReservation}>
          <h2>Réserver ce véhicule</h2>
          <label>Date de début :</label>
          <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required />
          <label>Date de fin :</label>
          <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required />
          <button type="submit">Réserver</button>
          {message && <p className="message">{message}</p>}
        </form>
      ) : (
        <p>Vous devez être connecté pour réserver ce véhicule.</p>
      )}
    </div>
  );
};

export default VehiculeDetail;
