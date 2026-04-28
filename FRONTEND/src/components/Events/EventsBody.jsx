import { Pagination } from "@mui/material";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchEvents, searchEvents } from "../../store/EventsSlice";
import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import SortBy from "../SortBy";

import LocationSelectorModal from "./LocationSelectorModal";

function EventsBody() {
  const dispatch = useDispatch();
  const { loadingList, error, events } = useSelector((state) => state.events);
  const eventsPerPage = 12;
  const [page, setPage] = useState(1);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const startIndex = (page - 1) * eventsPerPage;

  const { control, setValue, handleSubmit } = useForm();
  
  // Check for location on mount
  useEffect(() => {
    setShowLocationModal(true);
    dispatch(fetchEvents());
  }, [dispatch]);

  const parseLocation = (loc) => {
    if (!loc) return { city: "", state: "", zipcode: "" };
    const parts = loc.split(",").map((s) => s.trim());
    let city = "", state = "", zipcode = "";
    if (parts.length >= 3) {
      city = parts[0];
      state = parts[1];
      zipcode = parts[2];
    } else if (parts.length === 2) {
      city = parts[0];
      state = parts[1];
    } else {
      city = parts[0];
      state = parts[0];
      zipcode = parts[0];
    }
    return { city, state, zipcode };
  };

  const onLocationSubmit = (data) => {
    const { city, state, zipcode } = parseLocation(data?.location);
    dispatch(searchEvents({
      city,
      state,
      zipcode,
      eventType: [],
      priceMin: 0,
      priceMax: 15000,
    }));
  };

  const handleLocationSelect = () => {
    handleSubmit(onLocationSubmit)();
  };

  const handleModalLocationSelect = (locationString) => {
    setValue('location', locationString);
    const { city, state, zipcode } = parseLocation(locationString);
    dispatch(searchEvents({
      city,
      state,
      zipcode,
      eventType: [],
      priceMin: 0,
      priceMax: 15000,
    }));
    setShowLocationModal(false);
  };

  const handleShowAll = () => {
    dispatch(fetchEvents());
    setShowLocationModal(false);
  };

  const apiEvents = Array.isArray(events) ? events : [];
  const effectiveEvents = apiEvents;

  const [sortOption, setSortOption] = useState("created_at-desc");
  const getSortedEvents = () => {
    const eventsCopy = [...effectiveEvents];
    switch (sortOption) {
      case "price-asc":
        return eventsCopy.sort((a, b) => {
          const priceA = parseFloat(a.ticketPrice?.replace(/[^0-9.]/g, '') || 0);
          const priceB = parseFloat(b.ticketPrice?.replace(/[^0-9.]/g, '') || 0);
          return priceA - priceB;
        });
      case "price-desc":
        return eventsCopy.sort((a, b) => {
          const priceA = parseFloat(a.ticketPrice?.replace(/[^0-9.]/g, '') || 0);
          const priceB = parseFloat(b.ticketPrice?.replace(/[^0-9.]/g, '') || 0);
          return priceB - priceA;
        });
      default:
        // Use created_at if available, otherwise fallback to id or no sort
        return eventsCopy.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
  };

  const sortedEvents = getSortedEvents();
  const numsOfPage = Math.ceil(sortedEvents.length / eventsPerPage);
  const displayedEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);

  if (loadingList) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <LocationSelectorModal 
        open={showLocationModal} 
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleModalLocationSelect}
        onShowAll={handleShowAll}
      />
      <div className="mb-10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100/50">
        <form
          onSubmit={handleSubmit(onLocationSubmit)}
          className="w-full sm:w-[320px]"
        >
          <LocationAutocompleteInput
            control={control}
            setValue={setValue}
            type="search"
            onSelect={handleLocationSelect}
          />
        </form>
        <div className="ml-auto">
          <SortBy
            sortOption={sortOption}
            type="events"
            setSortOption={(value) => {
              setSortOption(value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-start sm:justify-items-center lg:justify-items-start">
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

      <div className="flex flex-row justify-between gap-8 items-center mt-12 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans whitespace-nowrap">
          Showing {startIndex + 1}-{Math.min(startIndex + eventsPerPage, effectiveEvents.length)} of {effectiveEvents.length} events
        </div>
        <Pagination
          count={numsOfPage}
          size="medium"
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={(event, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              borderColor: "#e5e7eb",
              borderRadius: "8px",
              fontWeight: "600",
              fontFamily: "DM Sans, sans-serif",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c",
              color: "white",
              borderColor: "#ffa41c",
              "&:hover": {
                backgroundColor: "#e69419",
              },
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast": {
              backgroundColor: "#f9fafb",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default EventsBody;
