import React from "react";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[80vh] px-4">
      <ThemeToggle />

      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white">
        Bienvenue chez <span className="text-blue-600 dark:text-purple-400">AS Motors</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl">
        Louez facilement votre véhicule préféré, avec une expérience fluide, moderne et 100% sécurisée.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <a
          href="/vehicules"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition"
        >
          Voir les véhicules
        </a>
        <a
          href="/contact"
          className="bg-gray-100 dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
};

export default HomePage;
