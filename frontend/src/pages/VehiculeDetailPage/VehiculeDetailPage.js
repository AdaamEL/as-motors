import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../VehiculeDetailPage/VehiculeDetailPage.css';

const VehiculeDetail = () => {
  const { id } = useParams(); // Récupère l'ID du véhicule depuis l'URL
  const [vehicule, setVehicule] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simule l'état de connexion

  useEffect(() => {
    // Simule une requête API pour récupérer les détails du véhicule
    const fetchVehicule = async () => {
      try {
        const response = await fetch(`/api/vehicules/${id}`);
        const data = await response.json();
        setVehicule(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du véhicule :', error);
      }
    };

    fetchVehicule();

    // Vérifie si l'utilisateur est connecté (à adapter selon votre logique d'authentification)
    const user = localStorage.getItem('user'); // Exemple avec localStorage
    setIsLoggedIn(!!user);
  }, [id]);

  if (!vehicule) {
    return <p>Chargement des détails du véhicule...</p>;
  }

  return (
    <div className="vehicule-detail">
      <h1>{vehicule.marque} {vehicule.modele}</h1>
      <img src={vehicule.image} alt={`${vehicule.marque} ${vehicule.modele}`} />
      <p><strong>Prix par jour :</strong> {vehicule.prix_jour} €</p>
      <p><strong>Description :</strong> {vehicule.description}</p>

      {isLoggedIn ? (
        <button className="btn-reserver" onClick={() => alert('Ouverture du calendrier pour réserver')}>
          Réserver
        </button>
      ) : (
        <p className="login-message">Connectez-vous pour réserver ce véhicule.</p>
      )}
    </div>
  );
};

export default VehiculeDetail;