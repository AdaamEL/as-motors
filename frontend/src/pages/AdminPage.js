import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/authContext";
import api, { API_ROOT } from "../services/api";
import {
  CalendarCheck, MessageSquare, Users, Loader2, Trash2, CheckCircle2,
  XCircle, FileText, Upload, Eye, Shield, UserCircle
} from "lucide-react";

const tabs = [
  { id: "reservations", label: "Réservations", icon: CalendarCheck },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "users", label: "Utilisateurs", icon: Users },
];

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

  /* ── Shared table wrapper ── */
  const TableWrapper = ({ children }) => (
    <div className="overflow-x-auto rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium">
      <table className="w-full text-sm">{children}</table>
    </div>
  );

  const Th = ({ children }) => (
    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      {children}
    </th>
  );

  const Td = ({ children, className = "" }) => (
    <td className={`px-5 py-4 ${className}`}>{children}</td>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="pt-32 pb-8 sm:pt-36 sm:pb-10 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="gold-accent mb-6" />
          <h1 className="section-heading mb-2">Administration</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les réservations, messages et utilisateurs
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/50 mb-8 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? "bg-white dark:bg-[#111827] text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-md ${
                tab === id
                  ? "bg-brand-50 dark:bg-brand/20 text-brand dark:text-gold"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>
                {id === "reservations" ? data.reservations.length : id === "messages" ? data.messages.length : data.users.length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand dark:text-gold animate-spin" />
          </div>
        ) : (
          <>
            {/* ── RÉSERVATIONS ── */}
            {tab === "reservations" && (
              <div className="space-y-4">
                {uploadError && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-400">
                    <XCircle className="w-4 h-4 flex-shrink-0" /> {uploadError}
                  </div>
                )}
                {uploadSuccess && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {uploadSuccess}
                  </div>
                )}

                <TableWrapper>
                  <thead className="border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <Th>Client</Th>
                      <Th>Véhicule</Th>
                      <Th>Dates</Th>
                      <Th>Montant</Th>
                      <Th>Statut</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {data.reservations.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-12 text-gray-400 dark:text-gray-500">Aucune réservation</td></tr>
                    ) : (
                      data.reservations.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                          <Td>
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{r.user_nom} {r.user_prenom}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500">{r.email}</div>
                          </Td>
                          <Td className="font-medium text-gray-900 dark:text-white">{r.vehicule_marque}</Td>
                          <Td>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(r.date_debut).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                              {" → "}
                              {new Date(r.date_fin).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                            </div>
                          </Td>
                          <Td className="font-semibold text-gray-900 dark:text-white">{r.montant_total}€</Td>
                          <Td>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                              r.statut === "confirmée"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                                : r.statut === "annulée"
                                ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
                            }`}>
                              {r.statut === "en_attente" ? "En attente" : r.statut}
                            </span>
                          </Td>
                          <Td>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {r.statut === "en_attente" && (
                                <>
                                  <button onClick={() => handleUpdateReservationStatus(r.id, "confirmée")} className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors" title="Valider">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleUpdateReservationStatus(r.id, "annulée")} className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors" title="Annuler">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              {r.statut === "confirmée" && (
                                r.devis_path ? (
                                  <a href={`${API_ROOT}${r.devis_path}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors" title="Voir devis">
                                    <Eye className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <label className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors cursor-pointer" title="Ajouter devis">
                                    <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUploadDevis(r.id, e.target.files?.[0])} />
                                    {uploadingId === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                  </label>
                                )
                              )}
                              <button onClick={() => handleDelete("/reservations", r.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Supprimer">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </TableWrapper>
              </div>
            )}

            {/* ── MESSAGES ── */}
            {tab === "messages" && (
              <TableWrapper>
                <thead className="border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <Th>Nom</Th>
                    <Th>Email</Th>
                    <Th>Sujet</Th>
                    <Th>Message</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {data.messages.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-gray-400 dark:text-gray-500">Aucun message</td></tr>
                  ) : (
                    data.messages.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <Td className="font-medium text-gray-900 dark:text-white">{m.nom}</Td>
                        <Td className="text-gray-500 dark:text-gray-400">{m.email}</Td>
                        <Td className="font-medium text-gray-900 dark:text-white">{m.sujet}</Td>
                        <Td><p className="text-gray-500 dark:text-gray-400 max-w-xs truncate">{m.contenu}</p></Td>
                        <Td>
                          <button onClick={() => handleDelete("/contact", m.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableWrapper>
            )}

            {/* ── UTILISATEURS ── */}
            {tab === "users" && (
              <TableWrapper>
                <thead className="border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <Th>Utilisateur</Th>
                    <Th>Email</Th>
                    <Th>Rôle</Th>
                    <Th>Actions</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {data.users.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-12 text-gray-400 dark:text-gray-500">Aucun utilisateur</td></tr>
                  ) : (
                    data.users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <Td>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              {u.role === "admin" ? <Shield className="w-4 h-4 text-brand dark:text-gold" /> : <UserCircle className="w-4 h-4 text-gray-400 dark:text-gray-500" />}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white text-sm">{u.prenom} {u.nom}</div>
                            </div>
                          </div>
                        </Td>
                        <Td className="text-gray-500 dark:text-gray-400">{u.email}</Td>
                        <Td>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            u.role === "admin"
                              ? "bg-brand-50 dark:bg-brand/20 text-brand dark:text-gold border-brand-100 dark:border-brand/30"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                          }`}>
                            {u.role === "admin" ? "Admin" : "Client"}
                          </span>
                        </Td>
                        <Td>
                          <button onClick={() => handleDelete("/auth/users", u.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors" title="Supprimer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </TableWrapper>
            )}
          </>
        )}
      </div>
    </div>
  );
}
