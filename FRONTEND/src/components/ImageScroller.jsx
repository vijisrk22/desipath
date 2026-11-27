import { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../utils/api";
import { getFullImageUrl } from "../utils/imageHelper";
import FullScreenImageViewer from "./FullScreenImageViewer";

function ImageScroller({
  images,
  autoAdvance = true,
  intervalMs = 3500,
  initialIndex = 0,
  onImageClick,
  enableFullScreen = true,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (initialIndex !== undefined && initialIndex !== currentIndex) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex]);

  const slide = (dir, e) => {
    e?.stopPropagation?.();
    if (animating || images.length <= 1) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) =>
        dir === "next"
          ? prev === images.length - 1 ? 0 : prev + 1
          : prev === 0 ? images.length - 1 : prev - 1
      );
      setAnimating(false);
    }, 350);
  };

  // Auto-advance
  useEffect(() => {
    if (!autoAdvance || images.length <= 1 || isFullScreenOpen) return;
    timerRef.current = setInterval(() => slide("next"), intervalMs);
    return () => clearInterval(timerRef.current);
  }, [images?.length, autoAdvance, intervalMs, animating, isFullScreenOpen]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (!autoAdvance || images.length <= 1 || isFullScreenOpen) return;
    timerRef.current = setInterval(() => slide("next"), intervalMs);
  };

  if (!images || images.length === 0) return null;

  const handleSlideClick = (e) => {
    // Call user-provided click handler if any
    onImageClick?.(currentIndex);

    // Open full screen viewer if enabled
    if (enableFullScreen) {
      setIsFullScreenOpen(true);
    }
  };

  const src = getFullImageUrl(images[currentIndex]);

  return (
    <>
      <div
        className="relative flex items-center justify-center h-full w-full overflow-hidden rounded-xl bg-black group select-none"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        {/* Blurred Background Layer */}
        <div 
          className="absolute inset-0 z-0 opacity-40 blur-2xl scale-110 pointer-events-none"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        />

        {/* Clickable Slide */}
        <div
          onClick={handleSlideClick}
          className="w-full h-full transition-all relative z-10 cursor-pointer flex items-center justify-center"
          title="Click to view full screen"
          style={{
            transform: animating
              ? direction === "next" ? "translateX(-8%)" : "translateX(8%)"
              : "translateX(0)",
            opacity: animating ? 0 : 1,
            transition: "transform 0.35s ease, opacity 0.35s ease",
          }}
        >
          <img
            src={src}
            alt={`Slide ${currentIndex + 1}`}
            className="object-contain w-full h-full cursor-pointer"
          />

          {/* Full Screen Hint Icon on hover / touch */}
          {enableFullScreen && (
            <div className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 border border-white/20 shadow-md backdrop-blur-sm pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div 
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(i > currentIndex ? "next" : "prev");
                  setCurrentIndex(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-white w-4" : "bg-white/50 w-2"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Left Arrow Button */}
        {images.length > 1 && (
          <IconButton
            onClick={(e) => slide("prev", e)}
            aria-label="Previous image"
            sx={{
              position: "absolute",
              top: "50%",
              left: "16px",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              backgroundColor: "rgba(0,0,0,0.45)",
              color: "white",
              borderRadius: "50%",
              zIndex: 20,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        )}

        {/* Right Arrow Button */}
        {images.length > 1 && (
          <IconButton
            onClick={(e) => slide("next", e)}
            aria-label="Next image"
            sx={{
              position: "absolute",
              top: "50%",
              right: "16px",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              backgroundColor: "rgba(0,0,0,0.45)",
              color: "white",
              borderRadius: "50%",
              zIndex: 20,
              "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      {/* Full Screen Lightbox Modal */}
      {enableFullScreen && (
        <FullScreenImageViewer
          images={images}
          initialIndex={currentIndex}
          isOpen={isFullScreenOpen}
          onClose={() => setIsFullScreenOpen(false)}
        />
      )}
    </>
  );
}

export default ImageScroller;
