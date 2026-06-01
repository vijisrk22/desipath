import TravelCompanionHomeCard from "./TravelCompanion/TravelCompanionHomeCard";
import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTravelCompanions, fetchTravelers } from "../store/TravelCompanionSlice";
import { CircularProgress } from "@mui/material";

function TravelCompanionCarousel({ title = "Travel Companions" }) {
  const dispatch = useDispatch();
  const { travelCompanions, travelers, loading } = useSelector((state) => state.travelCompanion);

  const settings = {
    dots: true,
    arrows: true,
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
    dispatch(fetchTravelCompanions());
    dispatch(fetchTravelers());
  }, [dispatch]);

  // Combine both types for the carousel
  const allPosts = [
      ...travelCompanions.map(p => ({ ...p, cardType: 'volunteer' })),
      ...travelers.map(p => ({ ...p, cardType: 'seeker' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      <SectionHeadings heading={title} link="/travel-companion" />

      <div className="w-full h-full mt-4">
        {loading && allPosts.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : allPosts && allPosts.length > 0 ? (
          <Slider {...settings}>
            {allPosts.slice(0, 9).map((post, index) => (
              <div key={index} className="px-4 pb-4 pt-1 h-full flex">
                <TravelCompanionHomeCard post={post} type={post.cardType} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-gray-500 text-center py-10">
            No travel companions available.
          </div>
        )}
      </div>
    </div>
  );
}

export default TravelCompanionCarousel;
