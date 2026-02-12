import React, { useState, useEffect } from "react";
import { getAllVehicules } from "../services/vehiculeService";
import VehiculeCard from "../components/VehiculeCard/VehiculeCard";
import { Car, Loader2 } from "lucide-react";

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getAllVehicules();
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="relative pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-4">
            Nos Véhicules
          </h1>
          <p className="section-subheading">
            Découvrez notre sélection de citadines premium disponibles à la location.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-brand dark:text-gold animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Chargement des véhicules...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        ) : vehicules.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun véhicule disponible pour le moment.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {vehicules.length} véhicule{vehicules.length > 1 ? "s" : ""} disponible{vehicules.length > 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicules.map((vehicule) => (
                <VehiculeCard key={vehicule.id} vehicule={vehicule} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehiculesPage;