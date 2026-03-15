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
  const [mobileBasePath, setMobileBasePath] = useState(null);
  const [mobileNextPath, setMobileNextPath] = useState(null);
  const [mobileNextVisible, setMobileNextVisible] = useState(false);
  const blurTimerRef = useRef(null);

  const activeImages = isMobile && !useDesktopFallback ? mobileImages : desktopImages;
  const activeImageName = activeImages[currentImageIndex] || activeImages[0];
  const imagePath = activeImageName ? `/uploads/home_page/${activeImageName}.JPG` : "/uploads/automobile.png";

  const isMobileSimpleMode = disableEffectsOnMobile && isMobile;

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
    if (!isMobileSimpleMode) return;

    if (!mobileBasePath) {
      setMobileBasePath(imagePath);
      return;
    }

    if (imagePath === mobileBasePath || imagePath === mobileNextPath) return;

    setMobileNextVisible(false);
    setMobileNextPath(imagePath);
  }, [imagePath, isMobileSimpleMode, mobileBasePath, mobileNextPath]);

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

  const handleImageError = (event) => {
    if (isMobile && !useDesktopFallback) {
      setUseDesktopFallback(true);
      return;
    }

    event.currentTarget.onerror = null;
    event.currentTarget.src = "/uploads/automobile.png";
  };

  const handleMobileNextLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);

    requestAnimationFrame(() => {
      setMobileNextVisible(true);
    });
  };

  const handleMobileTransitionEnd = () => {
    if (!mobileNextPath || !mobileNextVisible) return;

    setMobileBasePath(mobileNextPath);
    setMobileNextPath(null);
    setMobileNextVisible(false);
  };

  return (
    <div className="fixed left-0 top-0 w-full h-[100svh] h-[100dvh] overflow-hidden bg-black">
      {isMobileSimpleMode && (
        <>
          <img
            src={mobileBasePath || imagePath}
            alt={`Background ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleImageError}
          />

          {mobileNextPath && (
            <img
              src={mobileNextPath}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out"
              style={{ opacity: mobileNextVisible ? 1 : 0 }}
              onLoad={handleMobileNextLoad}
              onTransitionEnd={handleMobileTransitionEnd}
              onError={handleImageError}
            />
          )}
        </>
      )}

      {!isMobileSimpleMode && (
        <>
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
        onError={handleImageError}
      />
        </>
      )}
    </div>
  );
};

export default HomeHero;
