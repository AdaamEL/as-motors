import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HomeHero from "../components/Home/HomeHero";
import HomeHeader from "../components/Home/HomeHeader";
import HomeNav from "../components/Home/HomeNav";
import HomeBottomNav from "../components/Home/HomeBottomNav";
import CookieBanner from "../components/CookieBanner/CookieBanner";

const HomePage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const desktopHeroImages = useMemo(
    () => ["Home_1", "Home_2", "Home_3"],
    []
  );

  // Vous pouvez remplacer ces noms par des images mobiles dediees (ex: Home_1_mobile).
  const mobileHeroImages = useMemo(
    () => ["Home_1", "Home_2", "Home_3"],
    []
  );

  const slides = useMemo(
    () => [
      { index: 0, label: "Véhicules", to: "/vehicules" },
      { index: 1, label: "Contact", to: "/contact" },
      { index: 2, label: "Services", to: "/" },
    ],
    []
  );

  const totalSlides = slides.length;
  const activeSlide = slides[currentImageIndex] || slides[0];

  const handleMobileScroll = (event) => {
    const viewportHeight = window.visualViewport?.height || window.innerHeight || 1;
    const nextIndex = Math.round(event.currentTarget.scrollTop / viewportHeight);
    if (nextIndex !== currentImageIndex && nextIndex >= 0 && nextIndex < totalSlides) {
      setCurrentImageIndex(nextIndex);
    }
  };

  return (
    <div className="relative w-full h-[100svh] overflow-hidden">
      {/* Hero Background */}
      <HomeHero
        currentImageIndex={currentImageIndex}
        disableEffectsOnMobile={true}
        desktopImages={desktopHeroImages}
        mobileImages={mobileHeroImages}
      />

      {/* Mobile vertical snap track */}
      <div
        className="md:hidden absolute inset-0 z-10 overflow-y-auto no-scrollbar home-mobile-snap"
        onScroll={handleMobileScroll}
        aria-hidden="true"
      >
        {slides.map((slide) => (
          <section key={slide.index} className="h-[100svh] w-full home-mobile-snap-section" />
        ))}
      </div>

      {/* Mobile overlay: cinematic title + index */}
      <div className="md:hidden fixed inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/45" />
        <Link
          to={activeSlide.to}
          className="absolute left-6 bottom-[calc(env(safe-area-inset-bottom)+1.65rem)] text-white pointer-events-auto"
          aria-label={`Ouvrir ${activeSlide.label}`}
        >
          <h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[0.95]">{activeSlide.label}</h2>
        </Link>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 text-white">
          <span className="text-3xl font-medium">{currentImageIndex + 1}</span>
          <div className="w-px h-14 bg-white/75" />
          <span className="text-3xl font-light opacity-90">{totalSlides}</span>
        </div>
      </div>

      {/* Header */}
      <HomeHeader onMenuOpen={() => setMenuOpen(true)} isHomePage={true} />

      {/* Sidebar Navigation */}
      <HomeNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} isHomePage={true} />

      {/* Desktop Bottom Navigation */}
      <HomeBottomNav currentImageIndex={currentImageIndex} onImageChange={setCurrentImageIndex} />

      {/* Cookie Banner */}
      <CookieBanner discrete={true} />
    </div>
  );
};

export default HomePage;
