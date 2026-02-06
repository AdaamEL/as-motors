import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import api, { API_ROOT } from "../services/api";

export default function AdminPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tab, setTab] = useState("reservations");
  const [data, setData] = useState({
    reservations: [],
    messages: [],
    users: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // Protection
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rRes, mRes, uRes] = await Promise.all([
          api.get("/reservations").catch((err) => {
            console.error("Erreur reservations:", err.response?.status, err.message);
            return { data: [] };
          }),
          api.get("/contact").catch((err) => {
            console.error("Erreur contact:", err.response?.status, err.message);
            return { data: [] };
          }),
          api.get("/auth/users").catch((err) => {
            console.error("Erreur users:", err.response?.status, err.message);
            return { data: [] };
          }),
        ]);
        setData({
          reservations: rRes.data || [],
          messages: mRes.data || [],
          users: uRes.data || [],
        });
      } catch (err) {
        console.error("Erreur chargement:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      setData((prev) => ({
        ...prev,
        reservations: prev.reservations.filter((r) => r.id !== id),
        messages: prev.messages.filter((m) => m.id !== id),
        users: prev.users.filter((u) => u.id !== id),
      }));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handleUpdateReservationStatus = async (reservationId, newStatus) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}`, { status: newStatus });
      console.log("Réponse mise à jour:", response.data);
      
      // Mettre à jour l'état local
      setData((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId ? { ...r, statut: newStatus } : r
        ),
      }));
      
      alert(`Réservation ${newStatus === 'confirmée' ? 'validée' : 'annulée'} avec succès !`);
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
      alert("Erreur lors de la mise à jour du statut. Vérifiez la console.");
    }
  };

  const handleUploadDevis = async (reservationId, file) => {
    if (!file) return;
    setUploadingId(reservationId);
    setUploadError("");
    setUploadSuccess("");
    try {
      const formData = new FormData();
      formData.append("devis", file);

      const res = await api.post(`/reservations/${reservationId}/devis`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData((prev) => ({
        ...prev,
        reservations: prev.reservations.map((r) =>
          r.id === reservationId
            ? { ...r, devis_path: res.data?.devis_path || r.devis_path, devis_uploaded_at: res.data?.devis_uploaded_at || r.devis_uploaded_at }
            : r
        ),
      }));
      setUploadSuccess("Devis ajouté et envoyé au client.");
    } catch (err) {
      console.error("Erreur upload devis:", err);
      setUploadError("Impossible d'uploader le devis. Vérifiez le fichier et réessayez.");
    } finally {
      setUploadingId(null);
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="pt-20 sm:pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-600 mt-1">Gérez les réservations, messages et utilisateurs</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 mb-6 border-b">
          {[
            { id: "reservations", label: "Réservations" },
            { id: "messages", label: "Messages" },
            { id: "users", label: "Utilisateurs" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === item.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-600 hover:text-black"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : (
          <>
            {/* RÉSERVATIONS */}
            {tab === "reservations" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Réservations 
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({data.reservations.length})
                    </span>
                  </h2>
                </div>

                {uploadError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {uploadSuccess}
                  </div>
                )}
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700">Client</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Véhicule</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Début</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Fin</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Montant</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.reservations.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center p-8 text-gray-500">
                            Aucune réservation
                          </td>
                        </tr>
                      ) : (
                        data.reservations.map((r) => (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {r.user_nom} {r.user_prenom}
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{r.email}</td>
                            <td className="p-4">
                              <span className="font-medium text-gray-900">{r.vehicule_marque}</span>
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(r.date_debut).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(r.date_fin).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-gray-900">{r.montant_total}€</span>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
                                  r.statut === "confirmée"
                                    ? "bg-green-100 text-green-700"
                                    : r.statut === "annulée"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {r.statut}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {r.statut === "en_attente" && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateReservationStatus(r.id, "confirmée")}
                                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                                    >
                                      ✓ Valider
                                    </button>
                                    <button
                                      onClick={() => handleUpdateReservationStatus(r.id, "annulée")}
                                      className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 transition-colors"
                                    >
                                      ✕ Annuler
                                    </button>
                                  </>
                                )}
                                {r.statut === "confirmée" && (
                                  r.devis_path ? (
                                    <a
                                      href={`${API_ROOT}${r.devis_path}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                                    >
                                      📄 Voir devis
                                    </a>
                                  ) : (
                                    <label className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors cursor-pointer">
                                      <input
                                        type="file"
                                        accept="application/pdf"
                                        className="hidden"
                                        onChange={(e) => handleUploadDevis(r.id, e.target.files?.[0])}
                                      />
                                      {uploadingId === r.id ? "Upload..." : "📎 Ajouter devis"}
                                    </label>
                                  )
                                )}
                                <button
                                  onClick={() => handleDelete("/reservations", r.id)}
                                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                                >
                                  🗑 Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MESSAGES */}
            {tab === "messages" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Messages
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({data.messages.length})
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Sujet</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Message</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.messages.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center p-8 text-gray-500">
                            Aucun message
                          </td>
                        </tr>
                      ) : (
                        data.messages.map((m) => (
                          <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{m.nom}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{m.email}</td>
                            <td className="p-4">
                              <span className="font-medium text-gray-900">{m.sujet}</span>
                            </td>
                            <td className="p-4">
                              <p className="text-sm text-gray-600 max-w-xs truncate">{m.contenu}</p>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleDelete("/contact", m.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                              >
                                🗑 Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* UTILISATEURS */}
            {tab === "users" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Utilisateurs
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({data.users.length})
                    </span>
                  </h2>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-700">Prénom</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Nom</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Rôle</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center p-8 text-gray-500">
                            Aucun utilisateur
                          </td>
                        </tr>
                      ) : (
                        data.users.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{u.prenom}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{u.nom}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">{u.email}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center ${
                                  u.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {u.role === "admin" ? "👑 Admin" : "👤 Client"}
                              </span>
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleDelete("/auth/users", u.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                              >
                                🗑 Supprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
