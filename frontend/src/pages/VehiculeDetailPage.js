import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import VehiculeCarousel from '../components/vehicules/VehiculeCarousel'; // Import du carrousel
import { getVehiculeById } from '../services/vehiculeService'; // Import de l'API simplifiée

// --- MAPPING STATIQUE DES PRIX ET OPTIONS (En dur) ---
const STATIC_PRICES = {
    // ID 1 : Renault Clio V Alpine
    '1': {
        modele: 'Clio V Alpine',
        baseKm: '200 km/jour inclus',
        description: "La Clio V Alpine offre une expérience de conduite sportive et agile, parfaite pour la ville et les escapades du week-end. Équipée des dernières technologies et d'un design accrocheur.",
        caracteristiques: [
            { nom: 'Carburant', valeur: 'Essence' },
            { nom: 'Transmission', valeur: 'Automatique' },
            { nom: 'Sièges', valeur: '5' },
            { nom: 'Climatisation', valeur: 'Automatique' }
        ],
        options: [
            { duree: 'Par Jour (Semaine)', prix: '89 €' },
            { duree: '48h (Weekend Ven-Dim)', prix: '169 €' },
            { duree: '72h (Weekend Ven-Lun)', prix: '299 €' },
            { duree: '7 jours (Semaine Lun-Lun)', prix: '490 €' },
        ],
    },
    // ID 2 : Mercedes Class A 250e
    '2': {
        modele: 'Classe A 250e',
        baseKm: '200 km/jour inclus',
        description: "L'hybride rechargeable Mercedes allie luxe, efficacité et technologie. Conduisez en mode électrique pur pour vos trajets quotidiens et profitez de la puissance pour les longues distances.",
        caracteristiques: [
            { nom: 'Carburant', valeur: 'Hybride PHEV' },
            { nom: 'Transmission', valeur: 'Automatique' },
            { nom: 'Sièges', valeur: '5' },
            { nom: 'Connectivité', valeur: 'MBUX/Apple Car Play' }
        ],
        options: [
            { duree: 'Par Jour (Semaine)', prix: '139 €' },
            { duree: '48h (Weekend Ven-Dim)', prix: '279 €' },
            { duree: '72h (Weekend Ven-Lun)', prix: '329 €' },
            { duree: '7 jours (Semaine Lun-Lun)', prix: '749 €' },
        ],
    },
};
// --- FIN MAPPING STATIQUE ---


const VehiculeDetailPage = () => {
    // useParams() extrait l'ID du véhicule depuis l'URL
    const { id } = useParams(); 
    const [vehicule, setVehicule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupération des données statiques du prix
    const staticData = STATIC_PRICES[id] || STATIC_PRICES['1']; // Utilise ID 1 par défaut si non trouvé
    const optionsTarifaires = staticData.options;
    const description = staticData.description;
    const caracteristiques = staticData.caracteristiques;
    const baseKm = staticData.baseKm;

    useEffect(() => {
        const fetchVehicule = async () => {
            try {
                setLoading(true);
                // Le service API récupère seulement les données de la DB (Marque, Modèle, ID, etc.)
                const data = await getVehiculeById(id);
                setVehicule(data);
            } catch (err) {
                console.error("Erreur lors du chargement du détail du véhicule:", err);
                setError("Véhicule non trouvé ou erreur de connexion.");
            } finally {
                setLoading(false);
            }
        };

        // On s'assure que l'ID est valide avant l'appel API
        if (id && STATIC_PRICES[id]) {
            fetchVehicule();
        } else {
            setError("ID de véhicule invalide.");
            setLoading(false);
        }
        
    }, [id]); // Déclenche l'effet à chaque changement d'ID

    if (loading || !vehicule) {
      return (
        <>
          <Navbar />
          <div className="text-center p-8 dark:bg-gray-900 min-h-screen text-white">
            Chargement...
          </div>
          <Footer />
        </>
      );
    }

    if (error || !vehicule) {
        return (
            <>
                <Navbar />
                <div className="text-center p-8 min-h-screen dark:bg-gray-900 text-red-500">
                    <h1 className="text-4xl mb-4">Erreur 😔</h1>
                    <p>{error || "Données indisponibles."}</p>
                    <Link to="/vehicules" className="text-blue-500 hover:underline mt-4 block">
                        Retour au catalogue
                    </Link>
                </div>
                <Footer />
            </>
        );
    }
    
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
                
                <div className="container mx-auto px-4 py-8 pt-20">
                    <h1 className="text-4xl font-extrabold mb-2">{vehicule.marque} {vehicule.modele}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{description}</p>
                </div>

                <div className="lg:flex container mx-auto px-4 pb-8">
                    
                    {/* Colonne 1: GALERIE D'IMAGES */}
                    <section className="lg:w-2/3 lg:pr-8 mb-8">
                        <VehiculeCarousel vehiculeId={id} />
                    </section>
                    
                    {/* Colonne 2: PRIX, RÉSERVATION ET CARACTÉRISTIQUES */}
                    <section className="lg:w-1/3 space-y-8">
                        
                        {/* Bloc 1: Tarifs et Réservation (Sticky pour UX mobile) */}
                        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 sticky top-4">
                            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
                                Tarifs et Disponibilité
                            </h2>
                            
                            <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                Inclus : {baseKm} (options kilométriques disponibles)
                            </p>

                            {/* Tableau des Tarifs (Design compact) */}
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 mb-6">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {optionsTarifaires.map((option, index) => (
                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-2 text-sm font-medium">{option.duree}</td>
                                            <td className="py-2 text-right text-base font-extrabold text-gray-900 dark:text-white">
                                                {option.prix}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* CTA principal */}
                            <button
                                // 💡 Ici irait la logique de redirection ou d'ouverture du formulaire de réservation
                                className="w-full py-3 bg-green-600 text-white text-lg font-bold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                            >
                                Réserver ce véhicule
                            </button>
                        </div>
                        
                        {/* Bloc 2: Caractéristiques Techniques */}
                        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                            <h2 className="text-2xl font-bold mb-4">Fiche Technique</h2>
                            <ul className="space-y-3">
                                {caracteristiques.map((carac, index) => (
                                    <li key={index} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{carac.nom} :</span>
                                        <span className="font-semibold">{carac.valeur}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                    
                </div>
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default VehiculeDetailPage;