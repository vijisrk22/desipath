import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHouses } from "../store/HousesSlice";
import HouseCard from "./BuySellHouse/HouseCard";
import { CircularProgress } from "@mui/material";

function Homes() {
  const dispatch = useDispatch();
  const { houses: homes, loading } = useSelector((state) => state.houses);

  const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
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
    <div className="flex flex-col justify-start items-center gap-[24px]">
      <SectionHeadings heading="Homes for Sale" link="/services/houses" />
      <div className="w-full h-full px-2 mt-4">
        {loading && homes.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : homes && homes.length > 0 ? (
          <Slider {...settings}>
            {homes.slice(0, 8).map((home, index) => (
              <div key={index} className="px-2 pb-4 pt-1 h-full flex">
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
