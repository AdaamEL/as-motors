import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/authContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Menu, X } from "lucide-react";
import logoClair from "../../styles/logo_clair.png";
import logoSombre from "../../styles/logo_sombre.png";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoClair}
            alt="AS Motors"
            className="h-20 block dark:hidden"
          />
          <img
            src={logoSombre}
            alt="AS Motors"
            className="h-20 hidden dark:block"
          />
        </Link>

        <nav className="hidden md:flex gap-6 text-xl font-medium text-gray-800 dark:text-gray-200">
          <Link to="/" className="hover:text-brand-primary">Accueil</Link>
          <Link to="/vehicules" className="hover:text-brand-primary">Véhicules</Link>
          <Link to="/contact" className="hover:text-brand-primary">Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-brand-primary">Profil</Link>
              {user?.role === "admin" && <Link to="/admin" className="hover:text-brand-primary">Admin</Link>}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-400">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-brand-primary">Connexion</Link>
              <Link to="/register" className="hover:text-brand-primary">Inscription</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col items-start px-4 py-4 space-y-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Accueil</Link>
          <Link to="/vehicules" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Véhicules</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Profil</Link>
              {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Admin</Link>}
              <button onClick={handleLogout} className="text-red-500 w-full text-left">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Connexion</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block w-full hover:text-brand-primary">Inscription</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;