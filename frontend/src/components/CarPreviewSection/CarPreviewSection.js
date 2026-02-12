import React from 'react';
import './carPreviewSection.css';

const CarPreviewSection = () => {
  const cars = [
    {
      name: 'Clio V Alpine',
      image: '/uploads/vehicules/clio-alpine-primary.jpg',
      price: '150 €/jour',
    },
    {
      name: 'Peugeot 208',
      image: '/uploads/peugeot-208.jpg',
      price: '80 €/jour',
    },
    {
      name: 'Mercedes Classe A',
      image: '/uploads/mercedes-classe-a.jpg',
      price: '120 €/jour',
    },
  ];

  return (
    <section className="car-preview-section">
      <h2 className="car-preview-title">Nos véhicules en vedette</h2>
      <div className="car-preview-list">
        {cars.map((car, index) => (
          <div className="car-card" key={index}>
            <img src={car.image} alt={car.name} className="car-image" />
            <h3 className="car-name">{car.name}</h3>
            <p className="car-price">{car.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CarPreviewSection;