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
          <Link to="/" className="hover:text-[#6B1E1E]">Accueil</Link>
          <Link to="/vehicules" className="hover:text-[#6B1E1E]">Véhicules</Link>
          <Link to="/contact" className="hover:text-[#6B1E1E]">Contact</Link>

          {isAuthenticated ? (
            <>
              <Link to="/profile">Profil</Link>
              {user?.role === "admin" && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout} className="text-red-500 hover:underline">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
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
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 items-center">
          <Link to="/" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/vehicules" onClick={() => setMenuOpen(false)}>Véhicules</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link>
              {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button onClick={handleLogout} className="text-red-500">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Inscription</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
