import EventCard from "./Events/EventCard";
import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../store/EventsSlice";
import { CircularProgress } from "@mui/material";

function Events({ title = "Events in your Location" }) {
  const dispatch = useDispatch();
  const { events, loadingList } = useSelector((state) => state.events);

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
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      <SectionHeadings heading={title} link="/events" />

      <div className="w-full h-full mt-4">
        {loadingList && events.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <CircularProgress />
          </div>
        ) : events && events.length > 0 ? (
          <Slider {...settings}>
            {events.slice(0, 8).map((event, index) => (
              <div key={index} className="px-4 pb-4 pt-1 h-full flex">
                <EventCard event={event} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-gray-500 text-center py-10">
            No events available.
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
