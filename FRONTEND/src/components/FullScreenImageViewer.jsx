import React, { useState, useEffect } from "react";
import { getFullImageUrl } from "../utils/imageHelper";

export default function FullScreenImageViewer({
  images = [],
  initialIndex = 0,
  isOpen = false,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Sync index when initialIndex or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Lock body scroll while full screen is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation (Escape, ArrowRight, ArrowLeft)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const handleNext = (e) => {
    e?.stopPropagation?.();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch Swipe Handlers for mobile
  const minSwipeDistance = 45;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const currentSrc = getFullImageUrl(images[currentIndex]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col justify-between select-none animate-fade-in"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      {/* Top Header Bar */}
      <div
        className="w-full flex items-center justify-between px-4 py-3 md:px-6 md:py-4 z-50 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo Counter Badge */}
        <div className="bg-white/15 backdrop-blur-md text-white text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full border border-white/20">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 active:scale-95 text-white backdrop-blur-md border border-white/30 transition-all cursor-pointer shadow-lg"
          aria-label="Close full screen"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Main Image Viewport Area */}
      <div
        className="relative flex-1 flex items-center justify-center px-2 md:px-12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Image Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/30 backdrop-blur-md shadow-2xl active:scale-95 transition-all z-50 cursor-pointer"
            aria-label="Previous image"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Current Full Screen Image */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <img
            key={currentSrc}
            src={currentSrc}
            alt={`Full screen view ${currentIndex + 1}`}
            className="max-w-full max-h-[82vh] object-contain transition-opacity duration-300"
          />
        </div>

        {/* Next Image Arrow Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/30 backdrop-blur-md shadow-2xl active:scale-95 transition-all z-50 cursor-pointer"
            aria-label="Next image"
          >
            <svg
              className="w-6 h-6 md:w-7 md:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Bar / Dot Indicators */}
      <div
        className="w-full flex flex-col items-center justify-center pb-5 pt-3 z-50 bg-gradient-to-t from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        {images.length > 1 && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`transition-all rounded-full ${
                  i === currentIndex
                    ? "bg-white w-5 h-2"
                    : "bg-white/40 hover:bg-white/70 w-2 h-2"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
