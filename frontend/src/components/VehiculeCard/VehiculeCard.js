import React from 'react';
import './vehiculeCard.css';

const VehiculeCard = ({ vehicule }) => {
  console.log('Données du véhicule :', vehicule); // Vérifiez les données ici

  return (
    <div className="vehicule-card">
      <img
        src={`${vehicule.image}`} // Chemin relatif depuis le dossier public
        alt={`${vehicule.marque} ${vehicule.modele}`}
        className="vehicule-image"
      />
      <div className="vehicule-info">
        <h2>{vehicule.marque} {vehicule.modele}</h2>
        <p>Année : {vehicule.annee}</p>
        <p>Prix par jour : {vehicule.prix_jour} €</p>
        <p>{vehicule.description}</p>
        {vehicule.disponible ? (
          <span className="disponible">Disponible</span>
        ) : (
          <span className="indisponible">Indisponible</span>
        )}
      </div>
    </div>
  );
};

export default VehiculeCard;