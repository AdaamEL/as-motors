import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../services/authContext";
import "./navbar.css";
import logoLight from "../../styles/logo_clair.png"; // Logo clair
import logoDark from "../../styles/logo_sombre.png"; // Logo sombre

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // État du menu hamburger
  const [isDarkTheme, setIsDarkTheme] = useState(false); // État du thème
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  // Vérifie si le thème sombre est activé
  useEffect(() => {
    const isDark = document.body.classList.contains("dark-theme");
    setIsDarkTheme(isDark);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo dynamique */}
        <a href="/" className="navbar-logo">
          <img
            src={isDarkTheme ? logoDark : logoLight}
            alt="AS Motors Logo"
            className="navbar-logo-img"
          />
        </a>

        {/* Liens de navigation */}
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li>
            <a href="/vehicules">Véhicules</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
          {isAuthenticated && user.role === "admin" && (
            <li>
              <a href="/admin">Admin</a>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <a href="/profile">Profil</a>
              </li>
              <li>
                <button onClick={logout} className="btn-secondary">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/register" className="btn-secondary">
                  Inscription
                </a>
              </li>
              <li>
                <a href="/login" className="btn-primary">
                  Connexion
                </a>
              </li>
            </>
          )}
        </ul>

        {/* Bouton hamburger */}
        <button className="hamburger" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;