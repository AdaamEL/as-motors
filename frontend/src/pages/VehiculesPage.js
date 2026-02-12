import React, { useState, useEffect } from "react";
import { getAllVehicules } from "../services/vehiculeService";
import VehiculeCard from "../components/VehiculeCard/VehiculeCard";

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getAllVehicules();
        console.log("Données reçues dans VehiculesPage :", data); // LOG IMPORTANT
        setVehicules(data);
      } catch (err) {
        console.error("Erreur fetch:", err);
        setError("Impossible de charger les véhicules.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  if (loading) return <div className="text-center py-20 pt-32">Chargement...</div>;
  if (error) return <div className="text-center py-20 pt-32 text-red-600">{error}</div>;

  return (
    // Ajout de pt-24 pour éviter que la navbar cache le titre
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen bg-slate-50 dark:bg-slate-900">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-slate-900 dark:text-white">
        Nos Véhicules Disponibles
      </h1>
      
      {vehicules.length === 0 ? (
        <p className="text-center text-slate-600 dark:text-slate-400">Aucun véhicule trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicules.map((vehicule) => (
            <VehiculeCard key={vehicule.id} vehicule={vehicule} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiculesPage;