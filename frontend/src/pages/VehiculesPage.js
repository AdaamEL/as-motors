import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllVehicules } from "../services/vehiculeService";

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getAllVehicules();
        setVehicules(data);
      } catch (error) {
        console.error("Erreur chargement véhicules :", error);
      }
    };
    fetchVehicules();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-12 min-h-[calc(100vh-6rem)]">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Tous nos véhicules disponibles
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {vehicules.map((vehicule) => (
          <Link
            to={`/vehicules/${vehicule.id}`}
            key={vehicule.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={`/${vehicule.image}`}
              alt={`${vehicule.marque} ${vehicule.modele}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.jpg"; // optionnel si image manquante
              }}
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {vehicule.marque} {vehicule.modele}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {vehicule.annee} • {vehicule.prix_jour} €/jour
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VehiculesPage;
