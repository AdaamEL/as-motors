import React, { useState } from 'react';
import './footer.css';

const Footer = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme', !isDarkTheme);
  };

  return (
    <footer className="footer">
      <p>&copy; 2023 AS Motors. Tous droits réservés.</p>
      <button className="btn-theme" onClick={toggleTheme}>
        {isDarkTheme ? 'Thème clair' : 'Thème sombre'}
      </button>
    </footer>
  );
};

export default Footer;