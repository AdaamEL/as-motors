import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../services/authContext";
import api, { API_ROOT } from "../services/api";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Appel au nouvel endpoint spécifique "Mes Réservations"
        const response = await api.get("/reservations/user");
        setReservations(response.data);
      } catch (err) {
        console.error("Erreur historique:", err);
        setError("Impossible de récupérer votre historique.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return <div className="text-center py-20 pt-32">Veuillez vous connecter.</div>;

  return (
    <div className="container mx-auto px-4 py-12 pt-32 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête Profil */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mon Profil</h1>
              <div className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{user.prenom} {user.nom}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{user.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Section Historique */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Historique des Réservations</h2>
              <p className="text-gray-500 text-sm mt-1">{reservations.length} réservation{reservations.length > 1 ? 's' : ''} au total</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 bg-red-50 p-6 rounded-xl border border-red-200 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-lg mb-6">Aucune réservation pour le moment.</p>
              <button 
                onClick={() => navigate('/vehicules')}
                className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Louer un véhicule
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {reservations.map((res) => (
                <div 
                  key={res.id} 
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Véhicule */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-4 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {res.marque && res.modele ? `${res.marque} ${res.modele}` : `Véhicule #${res.vehicule_id}`}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">Réservation #{res.id}</p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="text-sm">
                          <div className="text-gray-500">Du</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(res.date_debut).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div className="text-sm">
                          <div className="text-gray-500">Au</div>
                          <div className="font-semibold text-gray-900">
                            {new Date(res.date_fin).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg px-6 py-3 border border-green-200 text-center">
                        <div className="text-xs text-gray-600 mb-1">Montant</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {res.montant_total > 0 ? `${res.montant_total}€` : "Devis"}
                        </div>
                      </div>

                      {res.devis_path && (
                        <a
                          href={`${API_ROOT}${res.devis_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white rounded-lg px-5 py-3 border border-blue-200 text-blue-700 font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                        >
                          📄 Télécharger le devis
                        </a>
                      )}

                      {/* Statut */}
                      <div>
                        <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase tracking-wide shadow-md ${
                          res.statut === 'confirmée' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                          res.statut === 'en_attente' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900' :
                          res.statut === 'annulée' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                          'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                        }`}>
                          {res.statut === 'confirmée' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {res.statut === 'en_attente' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                          )}
                          {res.statut === 'annulée' && (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          {res.statut === 'en_attente' ? 'En Attente' : res.statut}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;