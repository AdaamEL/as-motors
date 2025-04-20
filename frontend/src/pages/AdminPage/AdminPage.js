import React, { useState, useEffect } from "react";
import "./adminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, vehiclesRes, reservationsRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/users"),
          fetch("http://localhost:5000/api/vehicules"),
          fetch("http://localhost:5000/api/reservations"),
        ]);

        setUsers(await usersRes.json());
        setVehicles(await vehiclesRes.json());
        setReservations(await reservationsRes.json());
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  // Supprimer un utilisateur
  const deleteUser = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
    }
  };

  // Supprimer un véhicule
  const deleteVehicle = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/vehicles/${id}`, { method: "DELETE" });
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du véhicule :", error);
    }
  };

  // Modifier le statut d'une réservation
  const updateReservationStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatus }),
      });
      setReservations(
        reservations.map((reservation) =>
          reservation.id === id ? { ...reservation, statut: newStatus } : reservation
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  if (loading) {
    return <div className="admin-page">Chargement des données...</div>;
  }

  return (
    <div className="admin-page">
      <h1>Page Admin</h1>

      {/* Gestion des utilisateurs */}
      <section>
        <h2>Gestion des utilisateurs</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => deleteUser(user.id)} className="btn-danger">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Gestion des véhicules */}
      <section>
        <h2>Gestion des véhicules</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Prix/Jour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.marque}</td>
                <td>{vehicle.modele}</td>
                <td>{vehicle.prix_jour} €</td>
                <td>
                  <button onClick={() => deleteVehicle(vehicle.id)} className="btn-danger">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Gestion des réservations */}
      <section>
        <h2>Gestion des réservations</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Véhicule</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.id}</td>
                <td>{reservation.client_id}</td>
                <td>{reservation.voiture_id}</td>
                <td>{reservation.statut}</td>
                <td>
                  <select
                    value={reservation.statut}
                    onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                  >
                    <option value="confirmé">Confirmé</option>
                    <option value="en attente">En attente</option>
                    <option value="annulé">Annulé</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminPage;