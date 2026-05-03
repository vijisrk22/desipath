import { Pagination } from "@mui/material";
import EventCard from "./EventCard";
import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchEvents, searchEvents } from "../../store/EventsSlice";
import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import SortBy from "../SortBy";
import LocationSelectorModal from "../LocationSelectorModal";

const EVENTS_PER_PAGE   = 12;   // desktop pagination chunk
const MOBILE_BATCH_SIZE = 8;    // how many more cards to reveal on each scroll trigger

function EventsBody({ sortOption: sortProp, setSortOption: setSortProp }) {
  const dispatch = useDispatch();
  const { loadingList, events } = useSelector((state) => state.events);

  /* ── Desktop pagination state ─────────────────────────────────────── */
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * EVENTS_PER_PAGE;

  /* ── Mobile infinite-scroll state ────────────────────────────────── */
  const [mobileVisible, setMobileVisible] = useState(MOBILE_BATCH_SIZE);
  const sentinelRef = useRef(null);

  /* ── Location modal ───────────────────────────────────────────────── */
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { control, setValue, handleSubmit } = useForm();

  // Reset mobile scroll when sort / events change
  useEffect(() => { setMobileVisible(MOBILE_BATCH_SIZE); setPage(1); }, [events, sortProp]);

  // On mount: restore saved location or show modal
  useEffect(() => {
    const savedLocation = localStorage.getItem("user_location");
    if (!savedLocation) {
      setShowLocationModal(true);
      dispatch(fetchEvents()); // No location, show all
    } else {
      handleModalLocationSelect(savedLocation); // This triggers searchEvents
    }
  }, [dispatch]);

  /* ── IntersectionObserver for mobile infinite scroll ─────────────── */
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      setMobileVisible((prev) => prev + MOBILE_BATCH_SIZE);
    }
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

  /* ── Helpers ──────────────────────────────────────────────────────── */
  const parseLocation = (loc) => {
    if (!loc) return { city: "", state: "", zipcode: "" };
    const parts = loc.split(",").map((s) => s.trim());
    let city = "", state = "", zipcode = "";
    if (parts.length >= 3)      { city = parts[0]; state = parts[1]; zipcode = parts[2]; }
    else if (parts.length === 2) { city = parts[0]; state = parts[1]; }
    else                         { city = parts[0]; state = parts[0]; zipcode = parts[0]; }
    return { city, state, zipcode };
  };

  const onLocationSubmit = (data) => {
    const { city, state, zipcode } = parseLocation(data?.location);
    dispatch(searchEvents({ city, state, zipcode, eventType: [], priceMin: 0, priceMax: 15000 }));
  };

  const handleLocationSelect = () => handleSubmit(onLocationSubmit)();

  const handleModalLocationSelect = (locationString) => {
    setValue("location", locationString);
    const { city, state, zipcode } = parseLocation(locationString);
    dispatch(searchEvents({ city, state, zipcode, eventType: [], priceMin: 0, priceMax: 15000 }));
    setShowLocationModal(false);
  };

  const handleShowAll = () => { dispatch(fetchEvents()); setShowLocationModal(false); };

  /* ── Sort ─────────────────────────────────────────────────────────── */
  const [localSort, setLocalSort] = useState("created_at-desc");
  const sortOption    = sortProp    !== undefined ? sortProp    : localSort;
  const setSortOption = setSortProp !== undefined ? setSortProp : setLocalSort;

  const getSortedEvents = () => {
    const copy = [...(Array.isArray(events) ? events : [])];
    switch (sortOption) {
      case "price-asc":
        return copy.sort((a, b) =>
          parseFloat(a.ticketPrice?.replace(/[^0-9.]/g, "") || 0) -
          parseFloat(b.ticketPrice?.replace(/[^0-9.]/g, "") || 0));
      case "price-desc":
        return copy.sort((a, b) =>
          parseFloat(b.ticketPrice?.replace(/[^0-9.]/g, "") || 0) -
          parseFloat(a.ticketPrice?.replace(/[^0-9.]/g, "") || 0));
      default:
        return copy.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
  };

  const sortedEvents   = getSortedEvents();
  const totalEvents    = sortedEvents.length;

  /* Desktop slice */
  const numsOfPage      = Math.ceil(totalEvents / EVENTS_PER_PAGE);
  const desktopEvents   = sortedEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE);

  /* Mobile slice — grows as user scrolls */
  const mobileEvents    = sortedEvents.slice(0, mobileVisible);
  const hasMoreMobile   = mobileVisible < totalEvents;

  if (loadingList) return <Loader />;

  return (
    <div className="w-full">
      <LocationSelectorModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleModalLocationSelect}
        onShowAll={handleShowAll}
        buttonLabel="Show All Events"
      />

      {/* Location + Sort row */}
      <div className="mb-10 pt-3 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100/50">
        <form onSubmit={handleSubmit(onLocationSubmit)} className="w-full sm:w-[320px]">
          <LocationAutocompleteInput
            control={control}
            setValue={setValue}
            type="search"
            onSelect={handleLocationSelect}
          />
        </form>
        <div className="ml-auto hidden md:block">
          <SortBy
            sortOption={sortOption}
            type="events"
            setSortOption={(value) => { setSortOption(value); setPage(1); }}
          />
        </div>
      </div>

      {/* ── MOBILE: infinite scroll list ───────────────────────────── */}
      <div className="md:hidden">
        <div className="grid grid-cols-1 gap-6 justify-items-center sm:justify-items-start">
          {mobileEvents.length > 0 ? (
            mobileEvents.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <div className="py-20 text-center text-gray-500 text-lg font-medium w-full">
              No events found matching your criteria.
            </div>
          )}
        </div>

        {/* Sentinel — triggers next batch when visible */}
        {hasMoreMobile && (
          <div ref={sentinelRef} className="py-6 flex justify-center">
            <div className="w-7 h-7 border-4 border-blue-100 border-t-[#0857d0] rounded-full animate-spin" />
          </div>
        )}

        {/* End of list message */}
        {!hasMoreMobile && totalEvents > 0 && (
          <p className="text-center text-gray-400 text-sm py-8">
            You've seen all {totalEvents} events 🎉
          </p>
        )}
      </div>

      {/* ── DESKTOP: paginated grid ─────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 justify-items-start">
          {desktopEvents.length > 0 ? (
            desktopEvents.map((event, index) => (
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
            Showing {startIndex + 1}–{Math.min(startIndex + EVENTS_PER_PAGE, totalEvents)} of {totalEvents} events
          </div>
          <Pagination
            count={numsOfPage}
            size="medium"
            variant="outlined"
            shape="rounded"
            page={page}
            onChange={(_, value) => setPage(value)}
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
                "&:hover": { backgroundColor: "#e69419" },
              },
              "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast": {
                backgroundColor: "#f9fafb",
                "&:hover": { backgroundColor: "#f3f4f6" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EventsBody;
