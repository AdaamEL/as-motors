import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import { getVehiculeById } from "../services/vehiculeService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
      } catch (error) {
        console.error("Erreur de récupération du véhicule :", error);
        setErrorMsg("Véhicule introuvable ou erreur serveur.");
      }
    };

    const fetchReservedDates = async () => {
      try {
        const res = await fetch(`https://as-motors.onrender.com/api/vehicules/${id}/reservations`);
        const data = await res.json();
        const ranges = data.map((r) => ({
          start: new Date(r.date_debut),
          end: new Date(r.date_fin),
        }));
        setReservedRanges(ranges);
      } catch (error) {
        console.error("Erreur récupération réservations :", error);
      }
    };

    fetchVehicule();
    fetchReservedDates();
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");

    if (!dateDebut || !dateFin) {
      setErrorMsg("Veuillez renseigner les deux dates.");
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

  if (!vehicule && !errorMsg) return <p className="text-center py-20">Chargement...</p>;
  if (errorMsg) return <p className="text-center py-20 text-red-500">{errorMsg}</p>;

  return (
    <div className="flex justify-center items-center px-4 py-12 min-h-[calc(100vh-6rem)]">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <img
          src={`/${vehicule.image}`}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          className="w-full h-64 object-cover"
        />
        <div className="p-6 space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {vehicule.marque} {vehicule.modele}
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Prix par jour :</strong> {vehicule.prix_jour} €
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Année :</strong> {vehicule.annee}
          </p>

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
              <p className="text-sm text-red-500">* Les dates grisées sont déjà réservées</p>

              <button
                type="submit"
                className="bg-[#6B1E1E] hover:bg-[#5a1919] text-white px-6 py-2 rounded-md font-semibold transition"
              >
                Réserver
              </button>
              {message && (
                <p className="text-sm text-center text-green-600 dark:text-green-400">{message}</p>
              )}
              {errorMsg && (
                <p className="text-sm text-center text-red-600 dark:text-red-400">{errorMsg}</p>
              )}
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
