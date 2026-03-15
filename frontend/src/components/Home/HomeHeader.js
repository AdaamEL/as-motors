import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { AuthContext } from "../../services/authContext";

const logoClair = "/logo_clair_transparent.png";
const logoSombre = "/logo_sombre_transparent.png";

const HomeHeader = ({ onMenuOpen, isHomePage = false }) => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 flex items-center justify-between ${
      isHomePage 
        ? "" 
        : "bg-[var(--color-bg)] shadow-[0_2px_16px_rgba(15,15,15,0.06)]"
    }`}>
      {/* Hamburger left */}
      <button
        onClick={onMenuOpen}
        className="p-2 rounded-lg hover:bg-black/10 transition-colors"
        aria-label="Menu"
      >
        <Menu className={`w-7 h-7 ${
          isHomePage ? "text-[var(--color-surface)]" : "text-[var(--color-text)]"
        }`} />
      </button>

      {/* Logo center - large */}
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0">
        <img src={isHomePage ? logoClair : logoSombre} alt="AS Motors" className="h-20 sm:h-24 transition-all" />
      </Link>

      {/* Auth buttons right */}
      <div className="hidden md:flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className={`px-5 py-2.5 text-base font-medium rounded-lg transition-colors ${
                isHomePage
                  ? "text-[var(--color-surface)] hover:text-white hover:bg-black/20 border border-[color:rgba(214,214,212,0.55)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
              }`}
            >
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className={`px-5 py-2.5 text-base font-medium rounded-lg transition-colors ${
                isHomePage
                  ? "text-[var(--color-surface)] hover:text-white hover:bg-black/20 border border-[color:rgba(214,214,212,0.55)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
              }`}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`px-6 py-3 text-base font-medium rounded-lg transition-colors ${
                isHomePage
                  ? "text-[var(--color-surface)] hover:text-white hover:bg-black/20 border border-[color:rgba(214,214,212,0.55)]"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
              }`}
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className={`px-7 py-3 text-base font-semibold rounded-lg transition-colors ${
                isHomePage
                  ? "text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-light)]"
                  : "text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand)]/90"
              }`}
            >
              S'inscrire
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
