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
    <header className="navbar bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo + Nom */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoClair}
            alt="AS Motors"
            className="h-8 block dark:hidden"
          />
          <img
            src={logoSombre}
            alt="AS Motors"
            className="h-8 hidden dark:block"
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center space-x-6 font-medium text-lg">
          <Link to="/" className="hover:text-blue-500">Accueil</Link>
          <Link to="/vehicules" className="hover:text-blue-500">Véhicules</Link>
          <Link to="/contact" className="hover:text-blue-500">Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-blue-500">Profil</Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="hover:text-blue-500">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-500">Connexion</Link>
              <Link to="/register" className="hover:text-blue-500">Inscription</Link>
            </>
          )}
        </nav>

        {/* Theme toggle & Mobile menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-800 dark:text-gray-100"
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 px-4 py-4 space-y-4 text-center text-lg">
          <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/vehicules" onClick={() => setMenuOpen(false)}>Véhicules</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link>
              {user?.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="text-red-500">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Inscription</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
