import React, { useState } from "react";
import HomeHero from "../components/Home/HomeHero";
import HomeHeader from "../components/Home/HomeHeader";
import HomeNav from "../components/Home/HomeNav";
import HomeBottomNav from "../components/Home/HomeBottomNav";
import CookieBanner from "../components/CookieBanner/CookieBanner";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Hero Background */}
      <HomeHero currentImageIndex={currentImageIndex} />

      {/* Header */}
      <HomeHeader onMenuOpen={() => setMenuOpen(true)} isHomePage={true} />

      {/* Sidebar Navigation */}
      <HomeNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} isHomePage={true} />

      {/* Bottom Navigation */}
      <HomeBottomNav currentImageIndex={currentImageIndex} onImageChange={setCurrentImageIndex} />

      {/* Cookie Banner */}
      <CookieBanner discrete={true} />
    </div>
  );
};

export default HomePage;
