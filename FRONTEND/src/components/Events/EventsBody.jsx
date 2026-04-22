import { Pagination } from "@mui/material";
import EventCard from "./EventCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { fetchEvents, searchEvents } from "../../store/EventsSlice";
import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import MinimumDistanceSlider from "../PriceRangeSlider";

function EventsBody() {
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((state) => state.events);
  const eventsPerPage = 10;

  const { control, setValue, handleSubmit } = useForm();
  const [priceRange, setPriceRange] = useState([0, 15000]);

  // Set events on mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const onLocationSubmit = (data) => {
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

    const { city, state, zipcode } = parseLocation(data?.location);
    dispatch(searchEvents({
      city,
      state,
      zipcode,
      eventType: [],
      priceMin: priceRange[0],
      priceMax: priceRange[1],
    }));
  };

  const handleLocationSelect = () => {
    handleSubmit(onLocationSubmit)();
  };

  useEffect(() => {
    handleSubmit(onLocationSubmit)();
  }, [priceRange]);

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
      <div className="mb-8 flex flex-col xl:flex-row justify-start items-start xl:items-center gap-6">
        <form
          onSubmit={handleSubmit(onLocationSubmit)}
          className="w-full sm:w-[320px] bg-white rounded-[30px] shadow-sm flex items-center border border-gray-200"
        >
          <LocationAutocompleteInput
            control={control}
            setValue={setValue}
            type="search"
            onSelect={handleLocationSelect}
          />
        </form>

        <div className="w-full sm:w-[320px] bg-white rounded-[30px] shadow-sm flex items-center border border-gray-200 px-6 py-2">
          <MinimumDistanceSlider
            value={priceRange}
            onChange={setPriceRange}
            minRange={priceRange[0]}
            maxRange={priceRange[1]}
          />
        </div>
      </div>

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
              mx: "12px",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c",
              color: "white",
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#ffa41c",
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
