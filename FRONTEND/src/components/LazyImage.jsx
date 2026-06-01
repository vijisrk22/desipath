import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

const PLACEHOLDER = "/img/placeholder_property.jpg";

const LazyImage = ({ src, alt, className, style, fallback, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Reset state whenever the src changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setShowLoader(false);
  }, [src]);

  useEffect(() => {
    let timeout;
    if (!isLoaded && !hasError) {
      timeout = setTimeout(() => setShowLoader(true), 1500);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timeout);
  }, [isLoaded, hasError]);

  const imgSrc = hasError ? (fallback || PLACEHOLDER) : (src || PLACEHOLDER);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {showLoader && !isLoaded && !hasError && (
        <Box
          sx={{
            position: "absolute", top: 0, left: 0,
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(241,245,249,1)", zIndex: 1,
          }}
        >
          <CircularProgress size={28} thickness={4} sx={{ color: '#94a3b8' }} />
        </Box>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        loading="lazy"
        style={{
          ...style,
          opacity: isLoaded || hasError ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
        onLoad={() => { setIsLoaded(true); setShowLoader(false); }}
        onError={() => { setHasError(true); setIsLoaded(false); setShowLoader(false); }}
        {...props}
      />
    </Box>
  );
};

export default LazyImage;
