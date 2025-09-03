import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import { getVehiculeById } from "../services/vehiculeService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VehiculeCarousel from "../components/vehicules/VehiculeCarousel";

const VehiculeDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);

  const [vehicule, setVehicule] = useState(null);
  const [reservedRanges, setReservedRanges] = useState([]);
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const data = await getVehiculeById(id);
        setVehicule(data);

        // Récupération des plages réservées
        const res = await fetch(`https://as-motors.onrender.com/api/vehicules/${id}/reservations`);
        if (res.ok) {
          const reservations = await res.json();
          const ranges = reservations.map((r) => ({
            start: new Date(r.date_debut),
            end: new Date(r.date_fin),
          }));
          setReservedRanges(ranges);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchVehicule();
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!dateDebut || !dateFin) {
      setErrorMsg("Veuillez sélectionner une plage de dates.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://as-motors.onrender.com/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehicule_id: id,
          dateDebut,
          dateFin,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Erreur de réservation");

      setMessage("✅ Réservation envoyée avec succès !");
    } catch (error) {
      setErrorMsg(error.message || "Erreur lors de la réservation.");
    }
  };

  if (!vehicule) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
        <p className="text-gray-700 dark:text-gray-300">Chargement...</p>
      </div>
    );
  }

  // NEW: construit la liste d’images depuis la nouvelle API (images[].url)
  // Fallback: si pas d’array, on utilise l’ancienne colonne 'image'
  const images =
    Array.isArray(vehicule.images) && vehicule.images.length > 0
      ? vehicule.images.map((i) => i.url)
      : vehicule.image
      ? [`/${vehicule.image}`]
      : [];

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-[calc(100vh-6rem)]">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
        {/* NEW: carrousel si plusieurs images, sinon fallback single */}
        {images.length > 1 ? (
          <VehiculeCarousel images={images} />
        ) : (
          images[0] && (
            <img
              src={images[0]}
              alt={`${vehicule.marque} ${vehicule.modele}`}
              className="w-full h-64 object-cover"
            />
          )
        )}

        <div className="p-6 space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {vehicule.marque} {vehicule.modele}
          </h1>
          {vehicule.prix_jour != null && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Prix par jour :</strong> {vehicule.prix_jour} €
            </p>
          )}
          {vehicule.annee != null && (
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Année :</strong> {vehicule.annee}
            </p>
          )}

          {isAuthenticated ? (
            <form onSubmit={handleReservation} className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Réserver ce véhicule</h2>

              <div className="flex flex-col md:flex-row gap-4">
                <DatePicker
                  selected={dateDebut}
                  onChange={(date) => setDateDebut(date)}
                  excludeDateIntervals={reservedRanges}
                  selectsStart
                  startDate={dateDebut}
                  endDate={dateFin}
                  minDate={new Date()}
                  placeholderText="Date de début"
                  className="px-4 py-2 border rounded-md w-full dark:bg-gray-800 dark:text-white"
                />
                <DatePicker
                  selected={dateFin}
                  onChange={(date) => setDateFin(date)}
                  excludeDateIntervals={reservedRanges}
                  selectsEnd
                  startDate={dateDebut}
                  endDate={dateFin}
                  minDate={dateDebut || new Date()}
                  placeholderText="Date de fin"
                  className="px-4 py-2 border rounded-md w-full dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
              >
                Réserver
              </button>

              {message && <p className="text-sm text-center text-green-600 dark:text-green-400">{message}</p>}
              {errorMsg && <p className="text-sm text-center text-red-600 dark:text-red-400">{errorMsg}</p>}
            </form>
          ) : (
            <p className="text-gray-700 dark:text-gray-300">
              Vous devez être connecté pour réserver ce véhicule.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetailPage;
