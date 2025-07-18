import React from "react";

const HomePage = () => {
  return (
    <section className="flex flex-col justify-center items-center px-4 pt-20 pb-8 min-h-[calc(100vh-6rem)]">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-lg shadow-xl p-10 md:p-16 rounded-3xl text-center max-w-3xl w-full border border-gray-200 dark:border-gray-700 transition-all">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
          Bienvenue chez <span className="text-[#6B1E1E]">AS Motors</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          Réservez le véhicule parfait en quelques clics. Service rapide, fiable et sécurisé.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/vehicules"
            className="bg-[#6B1E1E] hover:bg-[#5a1919] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition"
          >
            Voir les véhicules
          </a>
          <a
            href="/contact"
            className="border border-gray-400 text-gray-900 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
