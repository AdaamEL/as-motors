import React, { useState, useContext } from "react";
import { AuthContext } from "../../services/authContext";
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // État du menu hamburger
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img src="/uploads/logo.png" alt="AS Motors Logo" />
        </a>

        {/* Liens de navigation */}
        <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
          <li><a href="/vehicules">Véhicules</a></li>
          <li><a href="/contact">Contact</a></li>
          {isAuthenticated && user.role === "admin" && (
            <li><a href="/admin">Admin</a></li>
          )}
          {isAuthenticated ? (
            <>
              <li>
                <a href="/profile">Profil</a>
              </li>
              <li>
                <button onClick={logout} className="btn-secondary">Déconnexion</button>
              </li>
            </>
          ) : (
            <>
              <li><a href="/register" className="btn-secondary">Inscription</a></li>
              <li><a href="/login" className="btn-primary">Connexion</a></li>
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