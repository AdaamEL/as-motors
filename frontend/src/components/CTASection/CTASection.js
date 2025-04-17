import React from 'react';
import './ctaSection.css';

const CTASection = () => {
  return (
    <div className="cta-section">
      <div className="container text-center">
        <h2>Prêt à prendre la route ?</h2>
        <p>Réservez dès maintenant votre véhicule et profitez d'une expérience de conduite exceptionnelle.</p>
        <a href="/vehicules" className="btn btn-primary">Réserver un véhicule</a>
      </div>
    </div>
  );
};

export default CTASection;
