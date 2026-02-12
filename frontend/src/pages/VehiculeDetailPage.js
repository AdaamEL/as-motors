import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker-custom.css';
import { AuthContext } from '../services/authContext';
import { getVehiculeById } from '../services/vehiculeService';
import api from '../services/api';
import VehiculeCarousel from '../components/vehicules/VehiculeCarousel';
import { Fuel, Settings, Users, Gauge, Calendar, ArrowLeft, AlertCircle, CheckCircle2, X } from 'lucide-react';

/* ─── Devis Modal ─── */
const DevisModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="relative bg-white dark:bg-navy-800 p-8 rounded-2xl max-w-md w-full shadow-premium-xl border border-gray-100 dark:border-gray-700 animate-scale-in">
      <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
        <X className="w-5 h-5 text-gray-400" />
      </button>
      <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand/20 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-6 h-6 text-brand dark:text-gold" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Demande enregistrée</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
        Votre demande de devis a été enregistrée avec succès.
        Notre équipe vous contactera dans les plus brefs délais avec un devis personnalisé.
      </p>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl font-semibold text-white bg-brand hover:bg-brand-light transition-colors"
      >
        Compris
      </button>
    </div>
  </div>
);

const VehiculeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [vehicule, setVehicule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDevisModal, setShowDevisModal] = useState(false);
  const [pricing, setPricing] = useState(null);
  const [blockedRanges, setBlockedRanges] = useState([]);

  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const data = await getVehiculeById(id);
        setVehicule(data);
      } catch (err) {
        setError("Impossible de charger le véhicule.");
      } finally {
        setLoading(false);
      }
    };

    const fetchPricing = async () => {
      try {
        const res = await api.get(`/reservations/pricing/${id}`);
        setPricing(res.data?.pricing || null);
      } catch (err) {
        setPricing(null);
      }
    };

    const fetchBlockedRanges = async () => {
      try {
        const res = await api.get(`/reservations/vehicule/${id}/blocked`);
        setBlockedRanges(res.data?.ranges || []);
      } catch (err) {
        setBlockedRanges([]);
      }
    };

    fetchVehicule();
    fetchPricing();
    fetchBlockedRanges();
  }, [id]);

  const handleReservation = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!user) { navigate('/login'); return; }
    if (!dateDebut || !dateFin) { setError('Veuillez sélectionner des dates de réservation.'); return; }

    try {
      const response = await api.post('/reservations', {
        vehicule_id: vehicule.id,
        date_debut: format(dateDebut, 'yyyy-MM-dd'),
        date_fin: format(dateFin, 'yyyy-MM-dd'),
        modele_cle: vehicule.modele_cle
      });

      if (response.status === 200 && response.data.isDevis) {
        setSuccessMsg(response.data.message || "Votre demande a bien été envoyée.");
        setShowDevisModal(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Ce véhicule n'est pas disponible aux dates sélectionnées.");
      } else {
        setError(err.response?.data?.message || "Erreur lors de la réservation.");
      }
    }
  };

  const excludedRanges = blockedRanges.map(r => ({
    start: new Date(r.date_debut),
    end: new Date(r.date_fin)
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="w-10 h-10 border-2 border-brand dark:border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicule) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] pt-20">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-lg text-gray-500 dark:text-gray-400">Véhicule introuvable.</p>
        <button onClick={() => navigate('/vehicules')} className="mt-4 text-brand dark:text-gold font-medium hover:underline">
          ← Retour aux véhicules
        </button>
      </div>
    );
  }

  const specs = [
    { icon: Fuel, label: "Motorisation", value: vehicule.motorisation || "Essence" },
    { icon: Settings, label: "Transmission", value: vehicule.transmission || "Automatique" },
    { icon: Users, label: "Places", value: `${vehicule.places || 5} places` },
    { icon: Gauge, label: "Puissance", value: `${vehicule.puissance || "N/A"} ch` },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {showDevisModal && <DevisModal onClose={() => setShowDevisModal(false)} />}

      {/* Back button bar */}
      <div className="pt-24 pb-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/vehicules')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux véhicules
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ═══ LEFT: Carousel (3/5 width on desktop) ═══ */}
          <div className="lg:col-span-3">
            <VehiculeCarousel vehiculeId={vehicule.id} />
          </div>

          {/* ═══ RIGHT: Info & Form (2/5 width on desktop) ═══ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title block */}
            <div>
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-brand-50 dark:bg-gold-50/10 text-brand dark:text-gold mb-3">
                {vehicule.categorie}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {vehicule.marque} {vehicule.modele}
              </h1>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-navy-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-navy-700 flex items-center justify-center shadow-sm">
                    <Icon className="w-4 h-4 text-brand dark:text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Table */}
            {pricing && (
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="px-5 py-4 bg-gray-50 dark:bg-navy-800/60 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Grille tarifaire indicative</h3>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {[
                    { label: "24h semaine", price: pricing.prix24hSemaine },
                    { label: "48h week-end", price: pricing.prix48hWeekend },
                    { label: "72h week-end", price: pricing.prix72hWeekend },
                    { label: "Semaine", price: pricing.prixSemaine },
                  ].map(({ label, price }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{price}€</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 bg-gray-50 dark:bg-navy-800/30">
                  <p className="text-xs text-gray-400">Tarifs indicatifs — devis personnalisé pour chaque demande.</p>
                </div>
              </div>
            )}

            {/* ── Reservation Form ── */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sm:p-6 bg-white dark:bg-[#111827]">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-brand dark:text-gold" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Réserver ce véhicule</h3>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleReservation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Date de début</label>
                    <DatePicker
                      selected={dateDebut}
                      onChange={(date) => setDateDebut(date)}
                      selectsStart
                      startDate={dateDebut}
                      endDate={dateFin}
                      minDate={new Date()}
                      excludeDateIntervals={excludedRanges}
                      dateFormat="dd/MM/yyyy"
                      required
                      className="input-premium !py-2.5 !text-sm"
                      placeholderText="Sélectionner"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Date de fin</label>
                    <DatePicker
                      selected={dateFin}
                      onChange={(date) => setDateFin(date)}
                      selectsEnd
                      startDate={dateDebut}
                      endDate={dateFin}
                      minDate={dateDebut || new Date()}
                      excludeDateIntervals={excludedRanges}
                      dateFormat="dd/MM/yyyy"
                      required
                      className="input-premium !py-2.5 !text-sm"
                      placeholderText="Sélectionner"
                    />
                  </div>
                </div>

                {blockedRanges.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs">
                    <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Dates indisponibles :</p>
                    <ul className="space-y-0.5 text-amber-700 dark:text-amber-400">
                      {blockedRanges.map((r, idx) => (
                        <li key={idx}>
                          {new Date(r.date_debut).toLocaleDateString("fr-FR")} → {new Date(r.date_fin).toLocaleDateString("fr-FR")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {user ? (
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #6B1E1E, #8B2E2E)" }}
                    >
                      Demander un devis
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Un devis personnalisé sera établi pour chaque demande.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-5 rounded-xl bg-gray-50 dark:bg-navy-800/40 border border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Connectez-vous pour réserver</p>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-light transition-colors"
                    >
                      Se connecter
                    </button>
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetailPage;