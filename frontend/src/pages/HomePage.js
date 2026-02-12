import React from "react";
import { Link } from "react-router-dom";
import { Car, Clock, ShieldCheck, Zap } from "lucide-react";

// Composant pour mettre en évidence les fonctionnalités (avec délai d'animation)
const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <div
    className="flex flex-col items-center p-6 bg-white/50 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition duration-300 animate-fade-in"
    style={{ animationDelay: `${delay}ms` }}
  >
    <Icon className="w-8 h-8 text-brand-primary mb-3" />
    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
      {title}
    </h3>
    <p className="text-center text-gray-700 dark:text-gray-300 text-base">
      {description}
    </p>
  </div>
);

const HomePage = () => {
  const heroImage = "/uploads/vehicules/car_accueil.jpg";

  return (
    <main className="w-full animated-background">
      {/* HERO */}
      <section
        className="
          relative w-screen left-1/2 -translate-x-1/2
          flex items-center justify-center
          min-h-[65vh] md:min-h-[75vh]
          overflow-hidden
        "
      >
        {/* Image de fond */}
        <div
          className="
            absolute inset-0 bg-cover bg-center md:bg-[length:115%] 
            transition-transform duration-[2000ms] car-drift-effect
          "
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "100%" }}
        />

        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80 hero-cinematic-overlay" />

        {/* Contenu */}
        <div className="relative z-10 text-center max-w-4xl w-full text-white px-4 sm:px-8 pt-16 pb-12 md:pt-0 md:pb-0 animate-fade-in-up">
          <p className="text-sm sm:text-base md:text-lg font-medium uppercase tracking-[0.25em] mb-3 text-brand-primary opacity-90">
            Compactes. Luxe. Instantané.
          </p>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight"
            style={{ textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}
          >
            Votre Citadine
            <span className="text-white"> Haut de Gamme.</span>
          </h1>

          <p className="text-lg sm:text-xl mb-8 font-light max-w-2xl mx-auto opacity-90">
            Découvrez le plaisir de conduire une voiture premium, parfaitement
            adaptée à la ville.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vehicules"
              className="
                bg-brand-primary text-white px-8 py-3 rounded-full 
                text-lg font-bold shadow-2xl transition duration-300 
                transform hover:scale-105 start-engine-pulse
              "
            >
              Voir le Catalogue
            </Link>
            <Link
              to="/contact"
              className="
                bg-white/10 text-white border border-white/30 px-8 py-3 
                rounded-full text-lg font-bold transition duration-300 
                transform hover:scale-105 hover:bg-white/20 hover:border-white
              "
            >
              Contact Rapide
            </Link>
          </div>
        </div>

        {/* Animation voiture qui démarre */}
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 overflow-visible">
          <div className="relative max-w-[1200px] mx-auto px-6 overflow-visible">
            <div className="car-global-layer">
              <div className="car-anim">

                {/* Icône voiture de luxe */}
                <img
                  src="/uploads/vehicules/luxury-car.png"        // <-- ton fichier ici
                  alt="Voiture de luxe"
                  className="car-icon-img"
                />

                {/* phares avant */}
                <div className="car-light-front" />

                {/* phares arrière */}
                <div className="car-light-back" />

                {/* fumée d'échappement */}
                <div className="car-smoke smoke-1" />
                <div className="car-smoke smoke-2" />
                <div className="car-smoke smoke-3" />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION AVANTAGES */}
      <section className="py-16 px-4 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white animate-fade-in-up">
            L&apos;Expérience <span className="text-brand-primary">AS Motors</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Zap}
              title="Flash Booking"
              description="Réservez en 60 secondes. L'efficacité au service de votre temps."
              delay={0}
            />
            <FeatureCard
              icon={Car}
              title="Citadines Premium"
              description="Seulement des modèles récents, haut de gamme et parfaitement équipés pour la ville."
              delay={100}
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Garantie Sérénité"
              description="Assurance tout risque et assistance 24/7. Roulez l'esprit léger."
              delay={200}
            />
            <FeatureCard
              icon={Clock}
              title="Service Ultra-Réactif"
              description="Notre équipe est là pour vous, à toute heure. Zéro attente, maximum d'action."
              delay={300}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
