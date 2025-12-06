import React from 'react';
import { Link } from 'react-router-dom';

const STATIC_PRIMARY_IMAGES = {
    '1': '/uploads/vehicules/clio-alpine-primary.jpg', 
    '2': '/uploads/vehicules/mercedes-a250e-primary.jpg'
};

const VehiculeCard = ({ vehicule }) => {
    const vehiculeId = vehicule.id ? vehicule.id.toString() : 'default';
    
    const imagePath = STATIC_PRIMARY_IMAGES[vehiculeId] || STATIC_PRIMARY_IMAGES['default'];

    const marque = vehicule.marque || 'Marque Inconnue';
    const modele = vehicule.modele || 'Modèle Inconnu';
    const prix = vehicule.prix || 'N/A';
    
    return (
        <div className="vehicule-card border rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl">
            
            <Link to={`/vehicules/${vehicule.id}`}>
                <img 
                    src={imagePath} 
                    alt={`${marque} ${modele}`} 
                    className="w-full h-48 object-cover" 
                />
            </Link>

            <div className="p-4 flex flex-col">
                <h3 className="text-xl font-bold mb-1 dark:text-white">
                    {marque} <span className="font-semibold text-blue-600 dark:text-blue-400">{modele}</span>
                </h3>
                
                <div className="flex justify-between items-center mt-2">
                    <p className="text-2xl font-extrabold text-green-600 dark:text-green-400">
                        {prix} €
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / jour</span>
                    </p>
                    
                    <Link 
                        to={`/vehicules/${vehicule.id}`} 
                        className="bg-blue-600 text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Réserver
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VehiculeCard;