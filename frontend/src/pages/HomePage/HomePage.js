import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import CarPreviewSection from '../../components/CarPreviewSection/CarPreviewSection';
import CTASection from '../../components/CTASection/CTASection';

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <CarPreviewSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};

export default HomePage;