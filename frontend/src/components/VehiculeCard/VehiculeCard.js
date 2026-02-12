import React from 'react';
import { Link } from 'react-router-dom';
import './vehiculeCard.css';

// Je reçois l'objet complet "vehicule" depuis le parent
const VehiculeCard = ({ vehicule }) => {
  const imagePath = `/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Container image avec hauteur fixe et object-cover pour le recadrage */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imagePath}
          alt={vehicule.marque}
          // "object-cover" va couper l'image pour remplir le cadre sans déformation
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/uploads/automobile.png"; // Fallback si l'image n'existe pas
          }}
        />
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {vehicule.marque} {vehicule.modele}
            </h3>
            <p className="text-gray-500 text-sm">{vehicule.categorie}</p>
          </div>
        </div>

        <div className="flex items-center text-gray-600 text-sm mb-6 space-x-4">
          <span className="flex items-center">
            <i className="fas fa-tachometer-alt mr-2"></i>
            {vehicule.kilometrage || "0"} km
          </span>
          <span className="flex items-center">
            <i className="fas fa-cogs mr-2"></i>
            Auto
          </span>
        </div>

        <Link
          to={`/vehicules/${vehicule.id}`}
          className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
};

export default VehiculeCard;