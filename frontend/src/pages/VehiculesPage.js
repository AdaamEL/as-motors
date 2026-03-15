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
    <div className="min-h-screen vehicle-grid-page pt-28 sm:pt-28">
      <section className="vehicle-grid-shell pt-12 sm:pt-16 pb-6 sm:pb-10">
        <p className="vehicle-grid-kicker text-center">Catalogue</p>
        <h1 className="vehicle-grid-heading">Nos véhicules</h1>
      </section>

      <section className="vehicle-grid-shell pb-10 sm:pb-20">
        {!loading && !error && vehicules.length > 0 && (
          <p className="vehicle-grid-kicker mb-6 sm:mb-8">
            {vehicules.length} véhicule{vehicules.length > 1 ? "s" : ""} disponible{vehicules.length > 1 ? "s" : ""}
          </p>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: "var(--color-editorial-accent)" }} />
            <p className="vehicle-grid-kicker">Chargement des véhicules...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4 bg-black/5">
              <Car className="w-8 h-8" style={{ color: "var(--color-editorial-accent)" }} />
            </div>
            <p className="text-base font-medium" style={{ color: "var(--color-editorial-ink)" }}>{error}</p>
          </div>
        ) : vehicules.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-sm flex items-center justify-center mx-auto mb-4 bg-black/5">
              <Car className="w-8 h-8" style={{ color: "var(--color-editorial-ink)" }} />
            </div>
            <p className="text-base" style={{ color: "color-mix(in srgb, var(--color-editorial-ink) 65%, white)" }}>
              Aucun véhicule disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="vehicle-grid-layout">
            {vehicules.map((vehicule) => (
              <VehiculeCard key={vehicule.id} vehicule={vehicule} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VehiculesPage;