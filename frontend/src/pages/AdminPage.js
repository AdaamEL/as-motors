import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../services/authContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, vehiculesRes, reservationsRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/users", { headers }),
          fetch("http://localhost:5000/api/vehicules", { headers }),
          fetch("http://localhost:5000/api/reservations", { headers }),
        ]);

        if (usersRes.status === 401 || vehiculesRes.status === 401 || reservationsRes.status === 401) {
          // Token expiré ou invalide → on déconnecte
          logout();
          navigate("/login");
          return;
        }

        if (!usersRes.ok || !vehiculesRes.ok || !reservationsRes.ok) {
          throw new Error("Une ou plusieurs requêtes ont échoué");
        }

        const usersData = await usersRes.json();
        const vehiculesData = await vehiculesRes.json();
        const reservationsData = await reservationsRes.json();

        setUsers(usersData);
        setVehicules(vehiculesData);
        setReservations(reservationsData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur chargement admin :", error);
        setErrorMsg(error.message);
      }
    };

    fetchData();
  }, [isAuthenticated, user, token, logout, navigate]);

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);
    }
  };

  const deleteVehicule = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/vehicules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicules(vehicules.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Erreur suppression véhicule :", error);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return <p className="text-center py-20 text-red-500">⛔ Accès refusé</p>;
  }

  if (loading) {
    return <p className="text-center py-20">Chargement...</p>;
  }

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto space-y-8 min-h-[calc(100vh-6rem)]">
      <h1 className="text-3xl font-bold text-center text-[#6B1E1E] dark:text-white">Panneau Administrateur</h1>
      {errorMsg && <p className="text-red-600 text-center">{errorMsg}</p>}

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Utilisateurs</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md flex justify-between items-center">
              <div>
                {u.nom} ({u.email}) - <span className="italic">{u.role}</span>
              </div>
              {u.role !== "admin" && (
                <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:underline text-sm">
                  Supprimer
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Véhicules</h2>
        <ul className="space-y-2">
          {vehicules.map((v) => (
            <li key={v.id} className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md flex justify-between items-center">
              <div>
                {v.marque} {v.modele} — <span className="italic">{v.prix_jour} €/j</span>
              </div>
              <button onClick={() => deleteVehicule(v.id)} className="text-red-600 hover:underline text-sm">
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Réservations</h2>
        <ul className="space-y-2">
          {reservations.map((r) => (
            <li key={r.id} className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-md">
              🧑 {r.user_id} | 🚗 {r.vehicule_id} | 📅 {r.date_debut} → {r.date_fin} | 🔖 {r.statut}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
