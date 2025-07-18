import React from "react";

const VehiculeCard = ({ vehicule }) => {
  const { image, marque, modele, annee, prix_jour } = vehicule;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-md transition hover:scale-[1.02]">
      <img
        src={image}
        alt={`${marque} ${modele}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-4 space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {marque} {modele}
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">Année : {annee}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Prix : <span className="font-semibold">{prix_jour} €</span> / jour
        </p>
        <div className="mt-2">
          <a
            href={`/vehicules/${vehicule.id}`}
            className="inline-block bg-[#6B1E1E] hover:bg-[#5a1919] text-white px-4 py-2 rounded-md text-sm transition"
          >
            Détails
          </a>
        </div>
      </div>
    </div>
  );
};

export default VehiculeCard;
