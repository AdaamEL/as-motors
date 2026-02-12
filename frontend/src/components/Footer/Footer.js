import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, MessageCircle, Ghost } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-white dark:bg-navy-900 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">
              AS <span className="text-brand dark:text-gold">Motor's</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Location premium de citadines haut de gamme. 
              L'élégance urbaine à portée de main.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Accueil" },
                { to: "/vehicules", label: "Véhicules" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Légal
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/legal/mentions", label: "Mentions légales" },
                { to: "/legal/privacy", label: "Confidentialité" },
                { to: "/legal/cookies", label: "Cookies" },
                { to: "/legal/terms", label: "CGU" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-brand dark:text-gold flex-shrink-0 mt-0.5" />
                <span>Paris, France</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-brand dark:text-gold flex-shrink-0 mt-0.5" />
                <span>+33 (0)7 83 36 67 60</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 text-brand dark:text-gold flex-shrink-0 mt-0.5" />
                <span>contact@as-motors.fr</span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-3">Réseaux</p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/as_motors75/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.snapchat.com/add/as_motors75"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Snapchat AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <Ghost className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/33783366760"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp AS Motors"
                  className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-brand dark:hover:text-gold hover:border-brand/30 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">
              Horaires
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 text-brand dark:text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p>Lun - Ven : 9h - 19h</p>
                  <p>Sam : 10h - 17h</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} AS Motors. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span>Conçu avec soin à Paris</span>
            <span className="opacity-40">•</span>
            <Link to="/legal/privacy" className="hover:text-brand dark:hover:text-gold transition-colors">Confidentialité</Link>
            <span className="opacity-40">•</span>
            <Link to="/legal/terms" className="hover:text-brand dark:hover:text-gold transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
