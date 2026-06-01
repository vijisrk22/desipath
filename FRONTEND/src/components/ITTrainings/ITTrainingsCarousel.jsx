import React, { useState, useEffect, useRef } from "react";
import SectionHeadings from "../SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GradientCourseCard from "./GradientCourseCard";
import { CircularProgress } from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import api from "../../utils/api";

function ITTrainingsCarousel() {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  useEffect(() => {
    setLoading(true);
    api.get("/api/it-training?limit=8")
      .then(res => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
            setTrainings(data.slice(0, 8));
        } else if (res.data.success && Array.isArray(res.data.data)) {
            setTrainings(res.data.data.slice(0, 8));
        }
      })
      .catch(err => console.error("Error fetching IT Trainings:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col justify-start items-center gap-6 w-full">
      <div className="w-full flex justify-between items-center px-2">
        <SectionHeadings heading="IT Trainings" link="/services/itTrainings" />
        <div className="flex gap-3">
          <button 
            onClick={() => sliderRef.current?.slickPrev()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeftIcon sx={{ color: '#007185' }} />
          </button>
          <button 
            onClick={() => sliderRef.current?.slickNext()}
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronRightIcon sx={{ color: '#007185' }} />
          </button>
        </div>
      </div>

      <div className="w-full h-full px-2">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : trainings && trainings.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {trainings.map((training, index) => (
              <div key={index} className="px-3 pb-4 pt-1 h-full flex">
                <GradientCourseCard result={training} index={index} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-gray-500 text-center py-10">No IT trainings available at the moment.</div>
        )}
      </div>
    </div>
  );
}

export default ITTrainingsCarousel;
