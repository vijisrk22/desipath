import EventCard from "./Events/EventCard";
import SectionHeadings from "./SectionHeadings";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import api from "../utils/api";

function Events({ title = "Events in your Location" }) {
  const events = [
    {
      image: "/img/events/eventSmpl1.png",
      title: "Universal Music Festival",
      time: "Mon, Dec 28 / 18:00 - 23:00 PM",
      location: "Grand Par, New York",
    },
    {
      image: "/img/events/eventSmpl2.png",
      title: "Tech Innovation Summit",
      time: "Tue, Jan 15 / 09:00 - 17:00 PM",
      location: "Silicon Valley, CA",
    },
    {
      image: "/img/events/eventSmpl3.png",
      title: "Art & Culture Exhibition",
      time: "Wed, Feb 03 / 10:00 - 20:00 PM",
      location: "Museum District, London",
    },
    {
      image: "/img/events/eventSmpl1.png",
      title: "Art & Culture Exhibition",
      time: "Wed, Feb 03 / 10:00 - 20:00 PM",
      location: "Museum District, London",
    },
  ];

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // Uncomment this block of code to fetch events from the
  // backend API endpoint /api/events

  // // State for events
  // const [events, setEvents] = useState([]);

  // // Set events on mount
  // useEffect(() => {
  //   api
  //     .get("/api/events")
  //     .then((res) => {
  //       setEvents(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      <SectionHeadings heading={title} link="/services/events" />

      <div className="w-full">
        <Slider {...settings}>
          {events.map((event, index) => {
            return <EventCard key={index} event={event} />;
          })}
        </Slider>
      </div>
    </div>
  );
}

export default Events;
