import React from 'react';
import './heroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Bienvenue chez AS MOTOR'S</h1>
        <p>Découvrez notre sélection de véhicules d'exception. Qualité, fiabilité et service personnalisé pour votre satisfaction.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Voir nos véhicules</button>
          <button className="btn-secondary">Nous contacter</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="/uploads/hero-car.jpg" alt="Voiture de luxe" />
      </div>
    </section>
  );
};

export default HeroSection;