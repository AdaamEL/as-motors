import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../services/authContext";
import "./adminPage.css";

const AdminPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") return;

    const fetchData = async () => {
      try {
        const [usersRes, vehiculesRes, reservationsRes, messagesRes] = await Promise.all([
          fetch("http://localhost:3000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/vehicules", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/reservations", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:3000/api/messages", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(await usersRes.json());
        setVehicules(await vehiculesRes.json());
        setReservations(await reservationsRes.json());
        setMessages(await messagesRes.json());
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, [isAuthenticated, user, token]);

  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/users/${id}`, {
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
      await fetch(`http://localhost:3000/api/vehicules/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicules(vehicules.filter((v) => v.id !== id));
    } catch (error) {
      console.error("Erreur suppression véhicule :", error);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return <p>Accès refusé. Cette page est réservée aux administrateurs.</p>;
  }

  if (loading) return <p>Chargement des données admin...</p>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Utilisateurs</h2>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.nom} ({u.email}) - {u.role}
              {u.role !== "admin" && (
                <button onClick={() => deleteUser(u.id)}>🗑 Supprimer</button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Véhicules</h2>
        <ul>
          {vehicules.map((v) => (
            <li key={v.id}>
              {v.marque} {v.modele} - {v.prix_jour} €/j
              <button onClick={() => deleteVehicule(v.id)}>🗑 Supprimer</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Réservations</h2>
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              Utilisateur {r.user_id} | Véhicule {r.vehicule_id} | {r.date_debut} → {r.date_fin} | {r.statut}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Messages</h2>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>
              <strong>{m.nom}</strong> ({m.email}) - {m.sujet}<br />
              {m.contenu}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
