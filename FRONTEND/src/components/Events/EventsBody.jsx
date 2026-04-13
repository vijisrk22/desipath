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
    <div className="px-[7%] mt-12 mb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#007185] text-[32px] md:text-[40px] font-bold font-dmsans">
          Popular Events
        </div>

        <div className="flex items-center gap-6">
          <div className=" text-gray-400 text-lg font-semibold font-dmsans flex gap-2 items-center cursor-pointer hover:text-gray-600 transition-colors">
            Sort by
            <button>
              <img src="/caretDown.svg" className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {displayedEvents.length > 0 ? (
          displayedEvents.map((event, index) => (
            <EventCard key={index} event={event} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No events found matching your criteria.
          </div>
        )}
      </div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, effectiveEvents.length)} of {effectiveEvents.length} events
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
