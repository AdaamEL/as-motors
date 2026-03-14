import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const HomeHero = ({
  currentImageIndex = 0,
  disableEffectsOnMobile = false,
  desktopImages = ["Home_1", "Home_2", "Home_3", "Home_4", "Home_5"],
  mobileImages = ["Home_1", "Home_2", "Home_3", "Home_4", "Home_5"],
}) => {
  const [showBlur, setShowBlur] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [useDesktopFallback, setUseDesktopFallback] = useState(false);
  const blurTimerRef = useRef(null);

  const activeImages = isMobile && !useDesktopFallback ? mobileImages : desktopImages;
  const activeImageName = activeImages[currentImageIndex] || activeImages[0];
  const imagePath = activeImageName ? `/uploads/home_page/${activeImageName}.JPG` : "/uploads/automobile.png";

  // Handle image index change before paint to avoid sharp flash
  useLayoutEffect(() => {
    setShowBlur(true);
    setUseDesktopFallback(false);

    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }
  }, [currentImageIndex]);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

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

    if (disableEffectsOnMobile && isMobile) {
      setShowBlur(false);
      return;
    }

    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
    }

    blurTimerRef.current = setTimeout(() => {
      setShowBlur(false);
    }, 550);
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {isPortrait && !(disableEffectsOnMobile && isMobile) && (
        <img
          src={imagePath}
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
        src={imagePath}
        alt={`Background ${currentImageIndex + 1}`}
        className={`absolute inset-0 w-full h-full ${isPortrait && !(disableEffectsOnMobile && isMobile) ? "object-contain" : "object-cover"}`}
        style={{
          filter: disableEffectsOnMobile && isMobile ? "none" : showBlur ? "blur(22px)" : "blur(0px)",
          opacity: disableEffectsOnMobile && isMobile ? 1 : showBlur ? 0.55 : 1,
          transform: disableEffectsOnMobile && isMobile ? "scale(1)" : showBlur ? "scale(1.03)" : "scale(1)",
          transition: disableEffectsOnMobile && isMobile
            ? "none"
            : "filter 1900ms ease-out, opacity 1900ms ease-out, transform 1900ms ease-out",
        }}
        onLoad={handleImageLoad}
        onError={(event) => {
          if (isMobile && !useDesktopFallback) {
            setUseDesktopFallback(true);
            return;
          }

          event.currentTarget.onerror = null;
          event.currentTarget.src = "/uploads/automobile.png";
        }}
      />
    </div>
  );
};

export default HomeHero;
