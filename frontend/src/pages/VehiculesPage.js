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
    <div className="min-h-screen bg-[var(--color-bg)] pt-28">
      {/* Header */}
      <div className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 px-4 bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-20 h-1 mx-auto mb-6" style={{ background: "linear-gradient(to right, var(--color-brand), var(--color-brand-light))" }} />
          <h1 className="text-5xl sm:text-6xl font-bold text-[var(--color-text)] mb-4">
            Nos Véhicules
          </h1>
          <p className="text-xl text-[var(--color-text-muted)]">
            Découvrez notre sélection de citadines premium disponibles à la location.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--color-brand)] animate-spin mb-4" />
            <p className="text-[var(--color-text-muted)]">Chargement des véhicules...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : vehicules.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-border)] flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-lg">Aucun véhicule disponible pour le moment.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[var(--color-text-muted)] mb-8">
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