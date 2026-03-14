import React from 'react';
import { Link } from 'react-router-dom';

const VehiculeCard = ({ vehicule }) => {
  const imagePath = `/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`;

  return (
    <Link
      to={`/vehicules/${vehicule.id}`}
      className="vehicle-grid-item"
    >
      <div className="vehicle-grid-media">
        <img
          src={imagePath}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/uploads/automobile.png";
          }}
        />
      </div>

      <div className="vehicle-grid-content">
        <h3 className="vehicle-grid-title">
          {vehicule.marque} {vehicule.modele}
        </h3>

        <div className="vehicle-grid-meta">
          <span>{vehicule.categorie || "Berline"}</span>
          <span className="vehicle-grid-dot">|</span>
          <span>{vehicule.carburant || "Essence"}</span>
          <span className="vehicle-grid-dot">|</span>
          <span>{vehicule.places || 5} places</span>
        </div>
      </div>
    </Link>
  );
};

export default VehiculeCard;