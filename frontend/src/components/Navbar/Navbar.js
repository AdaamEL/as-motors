import React, { useState } from 'react';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <img src="/uploads/logo.png" alt="AS Motors Logo" />
        </a>
        <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
          <li><a href="/vehicules">Véhicules</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/register" className="btn-secondary">Inscription</a></li>
          <li><a href="/login" className="btn-primary">Connexion</a></li>
        </ul>
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