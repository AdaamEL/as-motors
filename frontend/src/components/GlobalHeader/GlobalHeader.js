import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AuthContext } from "../../services/authContext";
import logoClair from "../../styles/logo_clair.png";

const GlobalHeader = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoClair} alt="AS Motors" className="h-16 transition-all" />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/vehicules"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/vehicules")
                  ? "text-[var(--color-brand)] bg-[var(--color-brand)]/10"
                  : "text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
              }`}
            >
              Véhicules
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive("/contact")
                  ? "text-[var(--color-brand)] bg-[var(--color-brand)]/10"
                  : "text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100/50 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] transition-colors"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[var(--color-brand)]/10 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-6 h-6 text-[var(--color-text)]" />
              ) : (
                <Menu className="w-6 h-6 text-[var(--color-text)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden pb-6 space-y-2 border-t border-[var(--color-border)] mt-2">
            <Link
              to="/vehicules"
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive("/vehicules")
                  ? "text-[var(--color-brand)] bg-[var(--color-brand)]/10"
                  : "text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
              }`}
            >
              Véhicules
            </Link>
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive("/contact")
                  ? "text-[var(--color-brand)] bg-[var(--color-brand)]/10"
                  : "text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5"
              }`}
            >
              Contact
            </Link>
            <div className="border-t border-[var(--color-border)] pt-2 mt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 transition-colors"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:text-red-700 hover:bg-red-100/50 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium text-[var(--color-text)] hover:text-[var(--color-brand)] transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-semibold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)] transition-colors text-center"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;
