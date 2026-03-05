import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

const HomeHero = ({ currentImageIndex = 0 }) => {
  const [showBlur, setShowBlur] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const blurTimerRef = useRef(null);

  const images = ["Home_1", "Home_2", "Home_3", "Home_4", "Home_5"];
  const imagePath = (index) => `/uploads/home_page/${images[index]}.JPG`;

  // Handle image index change before paint to avoid sharp flash
  useLayoutEffect(() => {
    setShowBlur(true);

    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, [currentImageIndex]);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  const handleImageLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);

    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
    }

    blurTimerRef.current = setTimeout(() => {
      setShowBlur(false);
    }, 550);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {isPortrait && (
        <img
          src={imagePath(currentImageIndex)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: "blur(22px)",
            opacity: 0.45,
            transform: "scale(1.08)",
          }}
        />
      )}

      <img
        src={imagePath(currentImageIndex)}
        alt={`Background ${currentImageIndex + 1}`}
        className={`absolute inset-0 w-full h-full ${isPortrait ? "object-contain" : "object-cover"}`}
        style={{
          filter: showBlur ? "blur(22px)" : "blur(0px)",
          opacity: showBlur ? 0.55 : 1,
          transform: showBlur ? "scale(1.03)" : "scale(1)",
          transition: "filter 1900ms ease-out, opacity 1900ms ease-out, transform 1900ms ease-out",
        }}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default HomeHero;
