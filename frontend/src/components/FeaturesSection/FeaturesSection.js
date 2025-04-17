import React from 'react';
import './featuresSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '/uploads/automobile.png', 
      title: 'Large choix de véhicules',
      description: 'Découvrez une large gamme de véhicules adaptés à tous vos besoins.',
    },
    {
      icon: '/uploads/money.png', 
      title: 'Prix compétitifs',
      description: 'Profitez des meilleurs tarifs pour la location de véhicules.',
    },
    {
      icon: '/uploads/telephone.png', 
      title: 'Service client 24/7',
      description: 'Notre équipe est disponible à tout moment pour répondre à vos questions.',
    },
  ];

  return (
    <section className="features-section">
      <h2 className="features-title">Pourquoi choisir AS Motor's ?</h2>
      <div className="features-list">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <img src={feature.icon} alt={feature.title} className="feature-icon" />
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;