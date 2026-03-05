import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { AuthContext } from "../../services/authContext";
import logoClair from "../../styles/logo_clair.png";
import logoSombre from "../../styles/logo_sombre.png";

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
        : "bg-[var(--color-bg)]"
    }`}>
      {/* Hamburger left */}
      <button
        onClick={onMenuOpen}
        className={`p-2 rounded-lg hover:bg-[var(--color-brand)]/10 transition-colors`}
        aria-label="Menu"
      >
        <Menu className={`w-7 h-7 ${
          isHomePage ? "text-white" : "text-[var(--color-text)]"
        }`} />
      </button>

      {/* Logo center - large */}
      <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 flex-shrink-0">
        <img src={isHomePage ? logoSombre : logoClair} alt="AS Motors" className="h-28 transition-all" />
      </Link>

      {/* Auth buttons right */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className={`px-5 py-2.5 text-base font-medium rounded-lg transition-colors ${
                isHomePage
                  ? "text-white hover:text-gray-200 hover:bg-white/10 border border-white/30"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
              }`}
            >
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className={`px-5 py-2.5 text-base font-medium rounded-lg transition-colors ${
                isHomePage
                  ? "text-white hover:text-gray-200 hover:bg-white/10 border border-white/30"
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
                  ? "text-white hover:text-gray-200 hover:bg-white/10 border border-white/30"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10"
              }`}
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className={`px-7 py-3 text-base font-semibold rounded-lg transition-colors ${
                isHomePage
                  ? "text-white bg-black/40 hover:bg-black/60 border border-white/30"
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
