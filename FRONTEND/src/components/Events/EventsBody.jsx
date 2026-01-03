import { Pagination } from "@mui/material";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchEvents } from "../../store/EventsSlice";
import { Link } from "react-router-dom";

function EventsBody() {
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((state) => state.events);
  const eventsPerPage = 10;

  const mockEvents = [
    {
      id: 1,
      title: "Umesh Barot - Live Concert",
      location: "Edison Expo Hall, NJ",
      date: "2024-11-16T19:00:00",
      image: "/img/events/eventSmpl1.png",
      ticketPrice: "$30",
    },
    {
      id: 2,
      title: "Avenged Sevenfold",
      location: "Jakarta, Indonesia",
      date: "2024-11-16T19:30:00",
      image: "/img/events/eventSmpl2.png",
      ticketPrice: "$50",
    },
    {
      id: 3,
      title: "Karthik Live",
      location: "Grand Pier, New York",
      date: "2024-11-16T19:00:00",
      image: "/img/events/eventSmpl3.png",
      ticketPrice: "$100",
    },
    {
      id: 4,
      title: "Umesh Barot - Live Concert",
      location: "Edison Expo Hall, NJ",
      date: "2024-11-16T19:00:00",
      image: "/img/events/eventSmpl1.png",
      ticketPrice: "$30",
    },
    {
      id: 5,
      title: "Avenged Sevenfold",
      location: "Jakarta, Indonesia",
      date: "2024-11-16T19:30:00",
      image: "/img/events/eventSmpl2.png",
      ticketPrice: "$50",
    },
    {
      id: 6,
      title: "Karthik Live",
      location: "Grand Pier, New York",
      date: "2024-11-16T19:00:00",
      image: "/img/events/eventSmpl3.png",
      ticketPrice: "$100",
    },
  ];

  // Set events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Merge API events (or mock) with Local Storage events
  const localEvents = JSON.parse(localStorage.getItem('userPostedEvents') || '[]');
  const apiEvents = Array.isArray(events) && events.length > 0 ? events : mockEvents;
  const effectiveEvents = [...localEvents, ...apiEvents];

  const numsOfPage = Math.ceil(effectiveEvents.length / eventsPerPage);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * eventsPerPage;
  const displayedEvents = effectiveEvents.slice(startIndex, startIndex + eventsPerPage);

  if (loading) {
    return <Loader />;
  }

  //   console.log(events);
  return (
    <div className="px-[7%] mt-20">
      <div className=" mb-6  flex justify-between items-center">
        <div className="text-[#007185] text-[40px] font-medium font-dmsans">
          Popular Events
        </div>

        <div className="flex items-center gap-6">
          <Link to="/services/events/postEvent">
            <button className="bg-[#ffa41c] text-white px-6 py-2.5 rounded-[30px] font-semibold font-dmsans text-[18px]">
              Post An Event
            </button>
          </Link>
          <div className=" text-gray-500 text-[22px] font-semibold font-dmsans flex gap-1 items-center cursor-pointer">
            Sort by
            <button>
              <img src="/caretDown.svg" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-4">
        {displayedEvents.map((event, index) => {
          return <EventCard key={index} event={event} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of {events.length}{" "}
          items
        </div>
        <Pagination
          count={numsOfPage}
          size="large"
          variant="outlined"
          shape="rounded"
          onChange={(event, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-page": {
              mx: "12px", // Adds spacing between page numbers
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c", // Sets the background color for the selected page
              color: "white", // Ensures text is visible
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#ffa41c", // Sets color for ellipsis (...)
              fontWeight: "bold",
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast":
            {
              color: "#ffa41",
              mx: "16px",
            },
          }}
        />
      </div>
    </div>
  );
}

export default EventsBody;
