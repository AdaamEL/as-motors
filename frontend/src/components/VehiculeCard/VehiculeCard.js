import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Fuel, Settings, Users } from 'lucide-react';

const VehiculeCard = ({ vehicule }) => {
  const imagePath = `/uploads/${vehicule.image_url}/${vehicule.image_url}-primary.jpg`;

  return (
    <Link
      to={`/vehicules/${vehicule.id}`}
      className="group block rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative h-56 sm:h-60 overflow-hidden bg-[var(--color-surface-alt)]">
        <img
          src={imagePath}
          alt={`${vehicule.marque} ${vehicule.modele}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/uploads/automobile.png";
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/90 backdrop-blur-sm text-[var(--color-text)] shadow-sm">
            {vehicule.categorie}
          </span>
        </div>

        {/* Disponibilité */}
        {vehicule.disponible !== undefined && (
          <div className="absolute top-4 right-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-sm ${
              vehicule.disponible
                ? "bg-emerald-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${vehicule.disponible ? "bg-emerald-200" : "bg-red-200"}`} />
              {vehicule.disponible ? "Disponible" : "Indisponible"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-1 group-hover:text-[var(--color-brand)] transition-colors duration-300">
          {vehicule.marque} {vehicule.modele}
        </h3>

        {/* Specs row */}
        <div className="flex items-center gap-4 mt-3 text-sm text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5" />
            {vehicule.motorisation || "Essence"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" />
            Auto
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {vehicule.places || 5}
          </span>
        </div>

        {/* Divider + CTA */}
        <div className="mt-5 pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-brand)]">
            Voir les détails
          </span>
          <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center group-hover:bg-[var(--color-brand)] transition-colors duration-300">
            <ArrowRight className="w-4 h-4 text-[var(--color-brand)] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VehiculeCard;