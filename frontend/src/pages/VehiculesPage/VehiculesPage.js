import React, { useEffect, useState } from 'react';
import VehiculeCard from '../../components/VehiculeCard/VehiculeCard';
import { getVehicules } from '../../services/api';
import './vehiculesPage.css';

const VehiculesPage = () => {
  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getVehicules();
        console.log('Données récupérées :', data);
        setVehicules(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
      }
    };

    fetchVehicules();
  }, []);

  return (
    <div className="vehicules-page">
      <h1>Nos Véhicules</h1>
      <div className="vehicules-list">
        {vehicules.map((vehicule) => (
          <VehiculeCard key={vehicule.id} vehicule={vehicule} />
        ))}
      </div>
    </div>
  );
};

export default VehiculesPage;