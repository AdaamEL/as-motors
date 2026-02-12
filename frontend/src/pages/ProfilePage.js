import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../services/authContext";
import api, { API_ROOT } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, LogOut, CalendarDays, ArrowRight, Loader2, AlertCircle,
  ClipboardList, CheckCircle2, Clock, XCircle, FileText, Car
} from "lucide-react";

const statusConfig = {
  confirmée: { label: "Confirmée", icon: CheckCircle2, classes: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" },
  en_attente: { label: "En attente", icon: Clock, classes: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20" },
  annulée: { label: "Annulée", icon: XCircle, classes: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20" },
};

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations/user");
        setReservations(response.data);
      } catch (err) {
        console.error("Erreur historique:", err);
        setError("Impossible de récupérer votre historique.");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchReservations();
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <p className="text-gray-500 dark:text-gray-400">Veuillez vous connecter.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <div className="pt-32 pb-16 sm:pt-36 sm:pb-20 px-4 bg-gray-50 dark:bg-navy-800/30 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="gold-accent mb-6" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-gray-900 dark:text-white">Mon Profil</h1>
              <div className="flex items-center gap-2 mt-3 text-gray-500 dark:text-gray-400">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user.prenom} {user.nom}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-gray-400 dark:text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>

      {/* Reservations */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <ClipboardList className="w-5 h-5 text-brand dark:text-gold" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Historique des réservations</h2>
          <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">
            {reservations.length} réservation{reservations.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand dark:text-gold animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-6">Aucune réservation pour le moment.</p>
            <button
              onClick={() => navigate("/vehicules")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
            >
              Découvrir nos véhicules
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map((res) => {
              const st = statusConfig[res.statut] || statusConfig.en_attente;
              const StatusIcon = st.icon;
              return (
                <div key={res.id} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 shadow-premium">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Vehicle + ID */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand/20 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-brand dark:text-gold" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {res.marque && res.modele ? `${res.marque} ${res.modele}` : `Véhicule #${res.vehicule_id}`}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Réservation #{res.id}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CalendarDays className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(res.date_debut).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span>{new Date(res.date_fin).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {res.montant_total > 0 ? `${res.montant_total}€` : "Devis"}
                      </span>
                    </div>

                    {/* Devis link */}
                    {res.devis_path && (
                      <a
                        href={`${API_ROOT}${res.devis_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-brand dark:text-gold bg-brand-50 dark:bg-gold/10 border border-brand-100 dark:border-gold/20 hover:bg-brand-100 dark:hover:bg-gold/20 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Devis
                      </a>
                    )}

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${st.classes}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {st.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;