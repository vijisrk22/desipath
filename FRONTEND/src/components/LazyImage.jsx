import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";

const LazyImage = ({ src, alt, className, style, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isLoaded) {
      // Show loader only if the image takes more than 2 seconds to load
      timeout = setTimeout(() => {
        setShowLoader(true);
      }, 2000);
    } else {
      setShowLoader(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {showLoader && !isLoaded && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            zIndex: 1,
            backdropFilter: "blur(2px)"
          }}
        >
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </Box>
  );
};

export default LazyImage;
