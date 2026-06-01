import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHouses } from "../store/HousesSlice";
import HouseCard from "./BuySellHouse/HouseCard";
import { CircularProgress } from "@mui/material";
import { useRef } from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function Homes() {
  const dispatch = useDispatch();
  const { houses: homes, loading } = useSelector((state) => state.houses);
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: false,
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
    dispatch(fetchHouses());
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-start items-center gap-6 w-full">
      <div className="w-full flex justify-between items-center px-2">
        <SectionHeadings heading="For Sale" link="/services/BuyHome" />
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
        {loading && homes.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : homes && homes.length > 0 ? (
          <Slider ref={sliderRef} {...settings}>
            {homes.slice(0, 8).map((home, index) => (
              <div key={index} className="px-3 pb-4 pt-1 h-full flex">
                <HouseCard house={home} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-gray-500 text-center py-10">No homes available.</div>
        )}
      </div>
    </div>
  );
}

export default Homes;
