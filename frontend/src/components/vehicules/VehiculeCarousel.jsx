import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand } from 'lucide-react';

// --- MAPPING STATIQUE DES GALERIES ---
const STATIC_VEHICULE_GALLERIES = {
  '1': [
    '/uploads/clio-alpine/clio-alpine-primary.jpg',
    '/uploads/clio-alpine/clio-alpine-1.jpg',
    '/uploads/clio-alpine/clio-alpine-2.jpg',
    '/uploads/clio-alpine/clio-alpine-3.jpg',
  ],
  '2': [
    '/uploads/mercedes-a250e/mercedes-a250e-primary.jpg',
    '/uploads/mercedes-a250e/mercedes-a250e-1.jpg',
    '/uploads/mercedes-a250e/mercedes-a250e-2.jpg',
    '/uploads/mercedes-a250e/mercedes-a250e-3.jpg',
  ],
  default: ['/uploads/default.jpg'],
};

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.95,
  }),
};

const VehiculeCarousel = ({ vehiculeId }) => {
  const key = vehiculeId ? String(vehiculeId) : 'default';
  const galleryImages =
    STATIC_VEHICULE_GALLERIES[key] || STATIC_VEHICULE_GALLERIES.default;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  // Touch support
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    setCurrentIndex(0);
    setDirection(0);
  }, [key]);

  // Keyboard navigation in fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fullscreen, currentIndex]);

  const goTo = (index, dir = 0) => {
    setDirection(dir);
    setCurrentIndex(index);
  };

  const nextImage = () => {
    goTo(currentIndex + 1 < galleryImages.length ? currentIndex + 1 : 0, 1);
  };

  const prevImage = () => {
    goTo(currentIndex - 1 >= 0 ? currentIndex - 1 : galleryImages.length - 1, -1);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].clientX);
    setTouchEndX(null);
  };
  const handleTouchMove = (e) => setTouchEndX(e.changedTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? nextImage() : prevImage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const mainImage = galleryImages[currentIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-navy-800 shadow-premium-lg cursor-pointer group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setFullscreen(true)}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={currentIndex}
              src={mainImage}
              alt={`Vue ${currentIndex + 1}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => { e.target.src = "/uploads/automobile.png"; }}
            />
          </AnimatePresence>

          {/* Expand icon */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Expand className="w-4 h-4 text-white" />
          </div>

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-navy-900/80 backdrop-blur-sm shadow-lg flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-navy-900/80 backdrop-blur-sm shadow-lg flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
              </button>
            </>
          )}

          {/* Dot indicators */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goTo(idx, idx > currentIndex ? 1 : -1); }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/30 backdrop-blur-sm text-xs font-medium text-white">
            {currentIndex + 1} / {galleryImages.length}
          </div>
        </div>

        {/* Thumbnails */}
        {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {galleryImages.map((imageSrc, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index, index > currentIndex ? 1 : -1)}
                className={`flex-shrink-0 w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-2 ring-brand dark:ring-gold ring-offset-2 ring-offset-[var(--color-bg)] opacity-100'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={imageSrc}
                  alt={`Vignette ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            {/* Close button */}
            <button
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
              onClick={() => setFullscreen(false)}
            >
              <span className="text-white text-xl font-light">✕</span>
            </button>

            {/* Image */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={currentIndex}
                src={mainImage}
                alt={`Vue ${currentIndex + 1}`}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => { e.target.src = "/uploads/automobile.png"; }}
              />
            </AnimatePresence>

            {/* Arrows in fullscreen */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium">
              {currentIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehiculeCarousel;
