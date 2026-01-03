import { useState } from "react";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import api from "../utils/api";

function ImageScroller({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  console.log("images", images);
  return (
    <div className="relative flex items-center justify-center h-[476px]">
      {/* Image Wrapper */}
      <div className="relative  h-full rounded-lg overflow-hidden">
        {/* Image */}
        <img
          src={`${api.defaults.baseURL}/${images[currentIndex]}`}
          alt={`Slide ${currentIndex}`}
          className="object-cover w-full h-full"
        />

        {/* Left Arrow */}
        <IconButton
          onClick={goToPrevious}
          sx={{
            position: "absolute",
            top: "50%",
            left: "16px",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            borderRadius: "50%",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        {/* Right Arrow */}
        <IconButton
          onClick={goToNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: "16px",
            transform: "translateY(-50%)",
            width: 48,
            height: 48,
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            borderRadius: "50%",
            zIndex: 10,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ImageScroller;
