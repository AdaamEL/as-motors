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

const MODEL_BLURBS = {
  "renault clio v alpine": "Sportivite accessible et caractere affirme. La Clio Alpine conjugue un chassis sport affine, un moteur essence vif et une finition exclusive pour une conduite engagee au quotidien.",
  "renault clio alpine": "Sportivite accessible et caractere affirme. La Clio Alpine conjugue un chassis sport affine, un moteur essence vif et une finition exclusive pour une conduite engagee au quotidien.",
  "mercedes a250e": "L'hybride rechargeable de la Classe A. La A250e allie la technologie EQ Power de Mercedes a un temperament sportif, pour une mobilite urbaine premium, econome et sans compromis.",
  "mercedes classe a250e": "L'hybride rechargeable de la Classe A. La A250e allie la technologie EQ Power de Mercedes a un temperament sportif, pour une mobilite urbaine premium, econome et sans compromis.",
  "mini cooper": "L'icone britannique dans toute son expression. Compacte, agile et irresistiblement stylee, la Mini Cooper incarne un plaisir de conduite unique, entre heritage et modernite audacieuse.",
};

/* ─── Devis Modal ─── */
const DevisModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="relative bg-[var(--color-surface)] p-8 rounded-2xl max-w-md w-full shadow-lg border border-[var(--color-border)] animate-scale-in">
      <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--color-surface-alt)] transition-colors">
        <X className="w-5 h-5 text-[var(--color-text-muted)]" />
      </button>
      <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-6 h-6 text-[var(--color-brand)]" />
      </div>
      <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">Demande enregistrée</h3>
      <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-6">
        Votre demande de devis a été enregistrée avec succès.
        Notre équipe vous contactera dans les plus brefs délais avec un devis personnalisé.
      </p>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-xl font-semibold text-white transition-colors"
        style={{ backgroundColor: "var(--color-brand)" }}
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
        <AlertCircle className="w-12 h-12 mb-4 text-[var(--color-text-muted)]" />
        <p className="text-lg text-[var(--color-text-muted)]">Véhicule introuvable.</p>
        <button onClick={() => navigate('/vehicules')} className="mt-4 font-medium hover:underline text-[var(--color-brand)]">
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

  const modelKey = `${vehicule.marque || ''} ${vehicule.modele || ''}`.toLowerCase().trim();
  const vehicleIntro =
    vehicule.description?.trim() ||
    MODEL_BLURBS[modelKey] ||
    "Un vehicule premium selectionne pour offrir style, confort et plaisir de conduite.";

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28">
      {showDevisModal && <DevisModal onClose={() => setShowDevisModal(false)} />}

      <div className="pt-14 pb-5 px-4 sm:px-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/vehicules')}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux véhicules
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <section className="mb-8 sm:mb-10 border border-[var(--color-border)] bg-[var(--color-bg)] rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="max-w-4xl">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] font-semibold bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
              {vehicule.categorie || "Vehicule premium"}
            </span>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl lg:text-3xl font-semibold text-[var(--color-text)] leading-[1.02]">
              {vehicule.marque} {vehicule.modele}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-3xl leading-snug">
              {vehicleIntro}
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {[vehicule.categorie || "Berline", vehicule.carburant || "Essence", vehicule.type_boite || "Automatique", `${vehicule.places || 5} places`].map((item) => (
                <span key={item} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs uppercase tracking-[0.14em] border border-[var(--color-border)] text-[var(--color-text-muted)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          <div className="lg:col-span-7 space-y-7">
            <div className="rounded-3xl border border-[var(--color-border)] p-4 sm:p-5">
              <VehiculeCarousel vehiculeId={vehicule.id} />
            </div>

            <section className="rounded-3xl border border-[var(--color-border)] p-5 sm:p-6 bg-[var(--color-bg)]">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--color-text)]">Caracteristiques</h2>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-text-muted)]">{label}</p>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-[var(--color-border)] pt-5">
                <h3 className="text-sm uppercase tracking-[0.16em] font-semibold text-[var(--color-text)]">A retenir</h3>
                <ul className="mt-3 space-y-1 text-sm leading-snug text-[var(--color-text-muted)]">
                  <li>• Véhicule préparé et contrôlé avant chaque remise.</li>
                  <li>• Devis personnalisé selon vos dates et votre besoin.</li>
                  <li>• Accompagnement humain et reponse rapide.</li>
                </ul>
              </div>
            </section>

            {pricing && (
              <section className="rounded-3xl border border-[var(--color-border)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[var(--color-border)]">
                  <h2 className="font-display text-2xl font-semibold text-[var(--color-text)]">Tarifs indicatifs</h2>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {[
                    { label: "24h semaine", price: pricing.prix24hSemaine },
                    { label: "48h week-end", price: pricing.prix48hWeekend },
                    { label: "72h week-end", price: pricing.prix72hWeekend },
                    { label: "Semaine", price: pricing.prixSemaine },
                  ].map(({ label, price }) => (
                    <div key={label} className="flex items-center justify-between px-5 py-3.5">
                      <span className="text-sm uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{label}</span>
                      <span className="text-base font-semibold text-[var(--color-text)]">{price}€</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-[var(--color-border)]">
                  <p className="text-xs text-[var(--color-text-muted)]">Tarifs indicatifs. Confirmation finale apres validation de la demande.</p>
                </div>
              </section>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-[var(--color-border)] p-5 sm:p-6 bg-[var(--color-bg)] lg:sticky lg:top-28">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-[var(--color-brand)]" />
                <h2 className="font-display text-2xl font-semibold text-[var(--color-text)]">Demander un devis</h2>
              </div>

              <p className="text-sm text-[var(--color-text-muted)] mb-5">
                Selectionnez vos dates. Nous revenons rapidement avec un devis adapte.
              </p>

              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              {successMsg && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-700">{successMsg}</p>
                </div>
              )}

              <form onSubmit={handleReservation} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Date de début</label>
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
                    <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">Date de fin</label>
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

                {user ? (
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    >
                      Demander un devis
                    </button>
                    <p className="text-xs text-[var(--color-text-muted)] text-center mt-3">
                      Sans engagement. Retour sous 24h ouvrées en general.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-5 rounded-xl border border-[var(--color-border)]">
                    <p className="text-sm text-[var(--color-text-muted)] mb-3">Connectez-vous pour réserver</p>
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    >
                      Se connecter
                    </button>
                  </div>
                )}
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetailPage;