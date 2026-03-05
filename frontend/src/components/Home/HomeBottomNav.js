import React from "react";
import { Link } from "react-router-dom";

const HomeBottomNav = ({ currentImageIndex = 0, onImageChange }) => {
  const tabs = [
    { index: 0, label: "Véhicules", to: "/vehicules" },
    { index: 1, label: "Contact", to: "/contact" },
    { index: 2, label: "Services", to: "/" },
    { index: 3, label: "À propos", to: "/" },
    { index: 4, label: "Showroom", to: "/" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 space-y-0">
      {tabs.map(({ index, label, to }) => (
        <Link
          key={index}
          to={to}
          onMouseEnter={() => onImageChange(index)}
          className={`block w-full px-8 py-5 text-left transition-all duration-200 ${
            currentImageIndex === index
              ? "text-7xl font-bold text-white"
              : "text-5xl font-light text-white/60 hover:text-white/80"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
};

export default HomeBottomNav;
