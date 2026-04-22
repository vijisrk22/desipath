import { Pagination } from "@mui/material";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchEvents } from "../../store/EventsSlice";
import { Link } from "react-router-dom";
import EventsCategoryPills from "./EventsCategoryPills";

function EventsBody() {
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((state) => state.events);
  const eventsPerPage = 10;

  // Set events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const apiEvents = Array.isArray(events) ? events : [];
  const effectiveEvents = apiEvents;

  const numsOfPage = Math.ceil(effectiveEvents.length / eventsPerPage);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * eventsPerPage;
  const displayedEvents = effectiveEvents.slice(startIndex, startIndex + eventsPerPage);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-[#323232] text-2xl md:text-3xl font-bold font-dmsans">
          Events In Chennai
        </h1>

        <div className="flex items-center gap-6">
          <a
            href="/services/events/postEvent"
            className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans whitespace-nowrap shadow-sm"
          >
            Post An Event
          </a>
        </div>
      </div>

      <EventsCategoryPills />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
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

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-12 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
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
