import React, { useState, useEffect, useContext } from 'react';
import { format } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker-custom.css';
import { AuthContext } from '../services/authContext';
import { getVehiculeById } from '../services/vehiculeService';
import api from '../services/api'; // Import direct d'axios configuré

// Composant Modal simple pour l'alerte Devis
const DevisModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-slate-900 p-8 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-2xl font-bold text-primary mb-4">Demande de Devis</h3>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Pour cette durée spécifique, nous devons établir un devis personnalisé.
        Votre demande a été enregistrée avec le statut "En attente".
        Notre équipe vous contactera rapidement.
      </p>
      <button
        onClick={onClose}
        className="w-full bg-blue-900 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-500"
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
  
  // Pour la galerie, on sélectionne l'image affichée en grand
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchVehicule = async () => {
      try {
        const data = await getVehiculeById(id);
        setVehicule(data);
        // Initialiser l'image principale avec le chemin local
        if (data && data.image_url) {
          setSelectedImage(`/uploads/${data.image_url}/${data.image_url}-primary.jpg`);
        }
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
        console.error("Erreur pricing:", err.response?.status, err.message);
        setPricing(null);
      }
    };

    const fetchBlockedRanges = async () => {
      try {
        const res = await api.get(`/reservations/vehicule/${id}/blocked`);
        setBlockedRanges(res.data?.ranges || []);
      } catch (err) {
        console.error("Erreur dates indisponibles:", err.response?.status, err.message);
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

    if (!user) {
      navigate('/login');
      return;
    }

    if (!dateDebut || !dateFin) {
      setError('Veuillez sélectionner des dates de réservation.');
      return;
    }

    try {
      // POST direct via api pour gérer finement les statuts
      const response = await api.post('/reservations', {
        vehicule_id: vehicule.id,
        date_debut: format(dateDebut, 'yyyy-MM-dd'),
        date_fin: format(dateFin, 'yyyy-MM-dd'),
        modele_cle: vehicule.modele_cle // CRUCIAL pour le calcul backend
      });

      // Gestion des réponses spécifiques du backend
      if (response.status === 200 && response.data.isDevis) {
        setSuccessMsg(response.data.message || "Votre demande a bien été envoyée. Un devis sera réalisé.");
        setShowDevisModal(true);
      }

    } catch (err) {
      // Gestion erreur 409 (Conflit / Non dispo)
      if (err.response && err.response.status === 409) {
        setError("Ce véhicule n'est pas disponible aux dates sélectionnées.");
      } else {
        setError(err.response?.data?.message || "Erreur lors de la réservation.");
      }
    }
  };

  // Convertir les plages bloquées en format excludeDateIntervals
  const excludedRanges = blockedRanges.map(r => ({
    start: new Date(r.date_debut),
    end: new Date(r.date_fin)
  }));

  if (loading) return <div className="text-center py-20">Chargement...</div>;
  if (!vehicule) return <div className="text-center py-20">Véhicule introuvable.</div>;

  // Génération des chemins pour la galerie (on suppose 4 images secondaires pour l'exemple)
  const galleryImages = [1, 2, 3, 4].map(
    idx => `/uploads/${vehicule.image_url}/${vehicule.image_url}-${idx}.jpg`
  );

  return (
    <div className="container mx-auto px-4 py-12 pt-24 min-h-screen bg-slate-50 dark:bg-slate-900">
      {showDevisModal && <DevisModal onClose={() => setShowDevisModal(false)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Section Images */}
        <div className="space-y-4">
          <div className="h-96 w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
            <img
              src={selectedImage}
              alt={vehicule.modele}
              className="w-full h-full object-cover" // Recadrage CSS
              onError={(e) => e.target.src = "/uploads/automobile.png"}
            />
          </div>
          
          {/* Galerie miniatures */}
          <div className="grid grid-cols-4 gap-4">
            {/* Bouton pour revenir à la primary */}
            <button 
                onClick={() => setSelectedImage(`/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`)}
                className="h-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary focus:outline-none"
            >
                <img 
                    src={`/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`} 
                    className="w-full h-full object-cover" 
                    alt="Principal"
                />
            </button>
            
            {/* Boucle sur les images secondaires */}
            {galleryImages.map((imgSrc, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(imgSrc)}
                className="h-24 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary focus:outline-none"
              >
                <img
                  src={imgSrc}
                  alt={`Vue ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'} // Cache si l'image n'existe pas
                />
              </button>
            ))}
          </div>
        </div>

        {/* Section Infos & Formulaire */}
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            {vehicule.marque} {vehicule.modele}
          </h1>
          <p className="text-xl text-primary font-semibold mb-6">{vehicule.categorie}</p>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-4">Caractéristiques</h3>
            <ul className="grid grid-cols-2 gap-y-2 text-slate-700 dark:text-slate-300">
              <li><i className="fas fa-gas-pump w-8"></i> {vehicule.motorisation || 'Essence'}</li>
              <li><i className="fas fa-cogs w-8"></i> {vehicule.transmission || 'Automatique'}</li>
              <li><i className="fas fa-chair w-8"></i> {vehicule.places || 5} Places</li>
              <li><i className="fas fa-tachometer-alt w-8"></i> {vehicule.puissance || 'N/A'} ch</li>
            </ul>
          </div>

          {pricing ? (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Grille tarifaire indicative</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="text-left p-3">Forfait</th>
                      <th className="text-left p-3">Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="p-3">24h semaine</td>
                      <td className="p-3 font-semibold">{pricing.prix24hSemaine}€</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="p-3">48h week‑end</td>
                      <td className="p-3 font-semibold">{pricing.prix48hWeekend}€</td>
                    </tr>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <td className="p-3">72h week‑end</td>
                      <td className="p-3 font-semibold">{pricing.prix72hWeekend}€</td>
                    </tr>
                    <tr>
                      <td className="p-3">Semaine</td>
                      <td className="p-3 font-semibold">{pricing.prixSemaine}€</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Tarifs indicatifs. Un devis final sera établi pour chaque demande.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl mb-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold mb-2">Grille tarifaire indicative</h3>
              <p className="text-sm text-slate-500">Aucune grille tarifaire disponible pour ce véhicule.</p>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-700 pt-8">
            <h3 className="text-2xl font-bold mb-6">Réserver ce véhicule</h3>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleReservation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Du</label>
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
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholderText="Sélectionner une date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Au</label>
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
                    className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholderText="Sélectionner une date"
                  />
                </div>
              </div>

              {blockedRanges.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-lg text-sm">
                  <p className="font-semibold mb-1">⚠️ Dates déjà réservées (désactivées dans le calendrier) :</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {blockedRanges.map((r, idx) => (
                      <li key={idx}>
                        {new Date(r.date_debut).toLocaleDateString("fr-FR")} → {new Date(r.date_fin).toLocaleDateString("fr-FR")}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

                <div className="pt-4">
                {user ? (
                  <div className="space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition-colors"
                    >
                      Demander un devis
                    </button>
                    <p className="text-xs text-slate-500 text-center">
                      Un devis personnalisé sera établi pour chaque demande.
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-yellow-800 dark:text-yellow-200 mb-2">Connectez-vous pour demander un devis</p>
                    <button 
                      type="button"
                      onClick={() => navigate('/login')}
                      className="bg-gray-900 dark:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm"
                    >
                      Se connecter
                    </button>
                  </div>
                )}
                </div>
            </form>
            <p className="text-xs text-slate-500 mt-4 text-center">
              * Toute demande fait l'objet d'un devis personnalisé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiculeDetailPage;