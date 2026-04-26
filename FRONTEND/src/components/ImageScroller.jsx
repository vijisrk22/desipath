import { useState, useEffect, useRef } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../utils/api";
import { getFullImageUrl } from "../utils/imageHelper";

function ImageScroller({ images, autoAdvance = true, intervalMs = 3500 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const timerRef = useRef(null);

  const slide = (dir) => {
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
    if (!autoAdvance || images.length <= 1) return;
    timerRef.current = setInterval(() => slide("next"), intervalMs);
    return () => clearInterval(timerRef.current);
  }, [images.length, autoAdvance, intervalMs, animating]);

  const pause = () => clearInterval(timerRef.current);
  const resume = () => {
    if (!autoAdvance || images.length <= 1) return;
    timerRef.current = setInterval(() => slide("next"), intervalMs);
  };

  if (!images || images.length === 0) return null;

  const src = getFullImageUrl(images[currentIndex]);

  return (
    <div
      className="relative flex items-center justify-center h-[476px] overflow-hidden rounded-xl bg-black"
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

      {/* Slide */}
      <div
        className="w-full h-full transition-all relative z-10"
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
          className="object-contain w-full h-full"
        />
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > currentIndex ? "next" : "prev"); setCurrentIndex(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-white w-4" : "bg-white/50"}`}
            />
          ))}
        </div>
      )}

      {/* Left Arrow */}
      {images.length > 1 && (
        <IconButton
          onClick={() => slide("prev")}
          sx={{
            position: "absolute", top: "50%", left: "16px", transform: "translateY(-50%)",
            width: 44, height: 44, backgroundColor: "rgba(0,0,0,0.45)", color: "white",
            borderRadius: "50%", zIndex: 10, "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
      )}

      {/* Right Arrow */}
      {images.length > 1 && (
        <IconButton
          onClick={() => slide("next")}
          sx={{
            position: "absolute", top: "50%", right: "16px", transform: "translateY(-50%)",
            width: 44, height: 44, backgroundColor: "rgba(0,0,0,0.45)", color: "white",
            borderRadius: "50%", zIndex: 10, "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}

export default ImageScroller;
