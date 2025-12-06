import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import VehiculeCard from '../components/VehiculeCard/VehiculeCard';
import { getVehicules } from '../services/vehiculeService'; // Assurez-vous que cette fonction est exportée

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        setLoading(true);
        const data = await getVehicules();
        setVehicules(data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des véhicules :", err);
        setError("Impossible de charger les véhicules. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  // Affichage du chargement (Squelette recommandé pour le look pro)
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            Chargement du Catalogue...
          </h1>
          {/* Squelette de chargement simulant les cartes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="vehicule-card border rounded-lg shadow-md overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-700">
                <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Affichage d'une erreur
  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8 min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900">
            <p className="text-red-500 text-lg">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  // Affichage principal du catalogue
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-4 md:p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
          Notre Sélection de Véhicules {vehicules.length > 0 && `(${vehicules.length})`}
        </h1>

        {vehicules.length === 0 ? (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Aucun véhicule n'est actuellement disponible dans notre catalogue.
            </p>
          </div>
        ) : (
          /*
           * 💡 DESIGN ADAPTÉ À UN PETIT CATALOGUE (2 voitures)
           * Nous forçons une grille simple pour mettre en valeur les cartes
           */
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {vehicules.map((vehicule) => (
              // Le composant VehiculeCard contient le mapping statique des images
              <VehiculeCard key={vehicule.id} vehicule={vehicule} />
            ))}
          </section>
        )}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default VehiculesPage;