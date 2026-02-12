import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ShieldCheck, Clock, Car, ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { getAllVehicules } from "../services/vehiculeService";

/* ─── Feature Card ─── */
const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => (
  <div
    className={`group relative p-8 rounded-2xl bg-white dark:bg-navy-800/60 border border-gray-100 dark:border-gray-800 
      shadow-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-1
      opacity-0 animate-fade-in-up`}
    style={{ animationDelay: `${index * 120}ms`, animationFillMode: "forwards" }}
  >
    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-6 h-6 text-brand dark:text-gold" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

/* ─── Vehicle Preview Card ─── */
const VehiclePreviewCard = ({ vehicule, index = 0 }) => {
  const imagePath = `/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`;
  return (
    <Link
      to={`/vehicules/${vehicule.id}`}
      className={`group block rounded-2xl overflow-hidden bg-white dark:bg-navy-800/60 border border-gray-100 dark:border-gray-800 
        shadow-premium hover:shadow-premium-xl transition-all duration-500 hover:-translate-y-2
        opacity-0 animate-fade-in-up`}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img
          src={imagePath}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = "/uploads/automobile.png"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gold/90 text-navy-900 backdrop-blur-sm">
            {vehicule.categorie}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand dark:group-hover:text-gold transition-colors">
          {vehicule.marque} {vehicule.modele}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{vehicule.motorisation || "Essence"}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span>{vehicule.transmission || "Auto"}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-brand dark:text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

/* ─── HomePage ─── */
const HomePage = () => {
  const heroImage = "/uploads/vehicules/car_accueil.jpg";
  const [vehicules, setVehicules] = useState([]);

  useEffect(() => {
    const fetchVehicules = async () => {
      try {
        const data = await getAllVehicules();
        setVehicules(data.slice(0, 3)); // Show 3 featured vehicles
      } catch (err) {
        console.error(err);
      }
    };
    fetchVehicules();
  }, []);

  return (
    <div className="w-full">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center hero-image-zoom"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient-overlay" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-5xl w-full px-6 sm:px-8 pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 opacity-0 animate-fade-in-down" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <Star className="w-4 h-4 text-gold" fill="currentColor" />
            <span className="text-sm font-medium text-white/90 tracking-wide">Location Premium de Citadines</span>
          </div>

          {/* Title */}
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            Votre Citadine
            <br />
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Haut de Gamme
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: "600ms", animationFillMode: "forwards" }}>
            Découvrez le plaisir de conduire une voiture premium,
            parfaitement adaptée à la ville.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "800ms", animationFillMode: "forwards" }}>
            <Link
              to="/vehicules"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-navy-900 shadow-gold-lg transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #C9A961, #D4BA7A)" }}
            >
              Voir le Catalogue
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/25 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              Nous Contacter
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 sm:mt-20 opacity-0 animate-fade-in" style={{ animationDelay: "1200ms", animationFillMode: "forwards" }}>
            <div className="w-6 h-10 rounded-full border-2 border-white/30 mx-auto flex justify-center pt-2">
              <div className="w-1 h-3 rounded-full bg-white/60 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section className="relative py-24 sm:py-32 px-4 bg-[var(--color-bg)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="gold-accent mb-6" />
            <h2 className="section-heading">
              L'Expérience{" "}
              <span className="text-brand dark:text-gold">AS Motors</span>
            </h2>
            <p className="section-subheading">
              Un service de location premium pensé pour votre confort, du premier clic à la remise des clés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Zap} title="Flash Booking" description="Réservez en 60 secondes. L'efficacité au service de votre temps." index={0} />
            <FeatureCard icon={Car} title="Citadines Premium" description="Seulement des modèles récents, haut de gamme et parfaitement équipés." index={1} />
            <FeatureCard icon={ShieldCheck} title="Garantie Sérénité" description="Assurance tous risques et assistance 24/7. Roulez l'esprit léger." index={2} />
            <FeatureCard icon={Clock} title="Service Réactif" description="Notre équipe est à votre disposition, à toute heure. Zéro attente." index={3} />
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED VEHICLES ═══════════ */}
      {vehicules.length > 0 && (
        <section className="py-24 sm:py-32 px-4 bg-gray-50 dark:bg-navy-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
              <div>
                <div className="gold-accent !mx-0 mb-6" />
                <h2 className="section-heading !text-left">
                  Notre Flotte
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-lg">
                  Des véhicules soigneusement sélectionnés pour allier performance, confort et élégance urbaine.
                </p>
              </div>
              <Link
                to="/vehicules"
                className="group inline-flex items-center gap-2 text-brand dark:text-gold font-semibold hover:gap-3 transition-all duration-300"
              >
                Tout voir
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicules.map((v, i) => (
                <VehiclePreviewCard key={v.id} vehicule={v} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ CTA SECTION ═══════════ */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-brand-dark" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle at 20% 50%, rgba(201,169,97,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(107,30,30,0.3) 0%, transparent 50%)"}} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Prêt à prendre la route{" "}
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              en toute élégance ?
            </span>
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
            Réservez dès maintenant et profitez d'une expérience de conduite inégalée en ville.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/vehicules"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-navy-900 shadow-gold-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #C9A961, #D4BA7A)" }}
            >
              Explorer le Catalogue
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
