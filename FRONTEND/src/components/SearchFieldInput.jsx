import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "./InputTemplate/LocationAutocompleteInput";
import MinimumDistanceSlider from "./PriceRangeSlider";
import SearchButton from "./SearchButton";

import { searchRoom } from "../store/RoommatesSlice";
import { searchCar } from "../store/CarsSlice";
import { searchRentalHome } from "../store/RentalHomesSlice";
import { searchHouse } from "../store/HousesSlice";
import { searchEvents } from "../store/EventsSlice";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CarMakeModelInput from "./InputTemplate/CarMakeModelInput";
import CheckBoxInput from "./InputTemplate/CheckBoxInput";
import { Dialog, DialogContent, Slide, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SearchFieldInput({ inputs, title }) {
  const {
    handleSubmit,
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([0, title === "Buy a Car" ? 100000 : 10000]);
  const [priceBounds, setPriceBounds] = useState([0, title === "Buy a Car" ? 100000 : 10000]);

  // Sync form with Redux active filters
  const state = useSelector((state) => {
    if (title === "Find a Room") return state.roommates;
    if (title === "Buy a Car") return state.cars;
    if (title === "Rent a Home") return state.rentalHomes;
    if (title === "Buy a home") return state.houses;
    if (title === "Find an Event") return state.events;
    return {};
  });
  const lastSearchQuery = state?.lastSearchQuery;
  const [hasAutoSearched, setHasAutoSearched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (isMobile) {
      setIsModalOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');

    // 1. Sync from Redux (lastSearchQuery)
    if (lastSearchQuery) {
      const reduxLoc = lastSearchQuery.location || [lastSearchQuery.city, lastSearchQuery.state, lastSearchQuery.zipcode].filter(Boolean).join(", ");
      
      // If global location changed elsewhere (e.g. Home page), prioritize it
      if (savedLocation && reduxLoc !== savedLocation && !hasAutoSearched) {
        setValue("location", savedLocation);
        setHasAutoSearched(true);
        handleSubmit(onSubmit)();
        return;
      }

      if (title === "Rent a Home" || title === "Buy a home" || title === "Buy a Car" || title === "Find a Room" || title === "Find an Event") {
        const newLoc = reduxLoc;
        if (watch("location") !== newLoc) {
          setValue("location", newLoc);
        }
        
        // Sync Price
        if (lastSearchQuery.priceMin !== undefined && lastSearchQuery.priceMax !== undefined) {
          if (priceRange[0] !== lastSearchQuery.priceMin || priceRange[1] !== lastSearchQuery.priceMax) {
            setPriceRange([lastSearchQuery.priceMin, lastSearchQuery.priceMax]);
          }
        }
        
        // Sync Types for Rental Homes
        if (title === "Rent a Home") {
          const rentalTypes = ["Condo", "Single family Home", "Apartment", "Basement Apartment"];
          rentalTypes.forEach(type => {
            const isChecked = lastSearchQuery.rentalHomeType?.includes(type);
            if (watch(`rentalHomeType.${type}`) !== isChecked) {
              setValue(`rentalHomeType.${type}`, isChecked); 
            }
          });
        }
      }
      return;
    }

    // 2. If no Redux query, check localStorage for session location
    if (savedLocation && !hasAutoSearched) {
      setValue("location", savedLocation);
      // Automatically trigger search ONCE
      setHasAutoSearched(true);
      handleSubmit(onSubmit)();
    }
  }, [lastSearchQuery, title, setValue, handleSubmit, hasAutoSearched, watch, priceRange]);

  useEffect(() => {
    const maxPrice =
      title === "Find a Room" ? 5000
      : title === "Buy a Car" ? 100000
      : title === "Rent a Home" ? 15000
      : title === "Buy a home" ? 5000000
      : title === "Find an Event" ? 1000
      : 10000;
    // Set absolute bounds and reset selected range to full range
    setPriceBounds([0, maxPrice]);
    setPriceRange([0, maxPrice]);
  }, [title]);

  async function onSubmit(data) {
    // Robust parsing helper
    const parseLocation = (loc) => {
      if (!loc || typeof loc !== 'string') return { city: "", state: "", zipcode: "" };
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
        // Single part: "San Diego 92101" or "92101" or "San Diego"
        const singlePart = parts[0];
        const subParts = singlePart.split(" ");
        const lastPart = subParts[subParts.length - 1];
        
        // If last part is numeric (Zip Code), extract it
        if (/^\d{5}(-\d{4})?$/.test(lastPart)) {
          zipcode = lastPart;
          city = subParts.slice(0, -1).join(" ").trim();
        } else {
          // Check if the whole thing is a zip code
          if (/^\d{5}(-\d{4})?$/.test(singlePart)) {
            zipcode = singlePart;
          } else {
            city = singlePart;
          }
        }
      }
      return { city, state, zipcode };
    };

    if (title === "Find a Room") {
      const { city, state, zipcode } = parseLocation(data?.location);
      const searchQuery = {
        city,
        state,
        zipcode,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchRoom(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Buy a Car") {
      const { city, state, zipcode } = parseLocation(data?.location);
      const searchQuery = {
        city,
        state,
        zipcode,
        location: typeof data?.location === 'object' ? (data.location?.name || JSON.stringify(data.location)) : String(data?.location || ""),
        carMake: typeof data?.make === 'object' ? (data.make?.make || data.make?.name || JSON.stringify(data.make)) : String(data?.make || ""),
        carModel: typeof data?.model === 'object' ? (data.model?.model || data.model?.name || JSON.stringify(data.model)) : String(data?.model || ""),
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchCar(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Rent a Home") {
      const { city, state, zipcode } = parseLocation(data?.location);
      const searchQuery = {
        city,
        state,
        zipcode,
        rentalHomeType: data?.rentalHomeType
          ? Object.entries(data.rentalHomeType)
            .filter(([_, value]) => value)
            .map(([key]) => key)
          : [],
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchRentalHome({ searchQuery })).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Buy a home") {
      const { city, state, zipcode } = parseLocation(data?.location);
      const searchQuery = {
        city,
        state,
        zipcode,
        priceMin: priceRange[0],
        priceMax: priceRange[1],
        homeType: data?.homeType
          ? Object.entries(data.homeType)
            .filter(([_, value]) => value)
            .map(([key]) => key)
          : [],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchHouse({ searchQuery })).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    } else if (title === "Find an Event") {
      const { city, state, zipcode } = parseLocation(data?.location);
      const searchQuery = {
        city,
        state,
        zipcode,
        eventType: data?.eventType
          ? Object.entries(data.eventType)
            .filter(([_, value]) => value)
            .map(([key]) => key)
          : [],
        priceMin: priceRange[0],
        priceMax: priceRange[1],
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchEvents(searchQuery)).unwrap();
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  }


  // Handler for auto-submit on selection
  const handleLocationSelect = () => {
    // Small timeout to allow state to update if needed, though setValue in child handles value.
    handleSubmit(onSubmit)();
    if (isModalOpen) setIsModalOpen(false);
  };

  const handleMobileSubmit = (data) => {
    onSubmit(data);
    setIsModalOpen(false);
  };

  const renderSearchContent = (isModal = false) => (
    <div className={`flex flex-col gap-6 ${isModal ? "p-4" : ""}`}>
      {/* Top Section: Location + Price Slider */}
      <div className={`flex flex-col gap-4 ${!isModal ? "md:flex-row md:items-center md:flex-1 w-full" : ""}`}>
        {inputs.includes("location") && (
          <div className={!isModal ? "md:flex-[2] md:min-w-[400px]" : ""}>
            <LocationAutocompleteInput
              control={control}
              setValue={setValue}
              type="search"
              onSelect={handleLocationSelect}
            />
          </div>
        )}

        {/* Price Slider Section */}
        <div className={!isModal ? "md:flex-1 md:min-w-[250px] lg:min-w-[300px] md:ml-4" : "mt-4"}>
          <MinimumDistanceSlider
            value={priceRange}
            onChange={setPriceRange}
            minRange={priceBounds[0]}
            maxRange={priceBounds[1]}
          />
        </div>
      </div>

      {/* Secondary Section: Filters (Make/Model or Types) + Search Button */}
      <div className={`flex flex-col gap-4 ${!isModal ? "md:flex-row md:items-center w-full" : ""}`}>
        {inputs.includes("makeAndModel") && (
          <div className={`flex gap-3 ${!isModal ? "md:flex-row md:items-center max-w-2xl flex-1" : "flex-col"}`}>
             <div className={!isModal ? "w-64" : "flex-1"}>
               <CarMakeModelInput
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  type="search"
                  onlyMake={true}
                />
             </div>
             <div className={!isModal ? "w-64" : "flex-1"}>
               <CarMakeModelInput
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  type="search"
                  onlyModel={true}
                />
             </div>
          </div>
        )}

        {/* Types Checkboxes (Moved here for desktop) */}
        {!isModal && (inputs.includes("type") || inputs.includes("eventType") || inputs.includes("homeType")) && (
          <div className="flex-1">
            {inputs.includes("type") && (
              <CheckBoxInput
                text="Type"
                options={[
                  { name: "rentalHomeType.Condo", label: "Condominium" },
                  { name: "rentalHomeType.Single family Home", label: "Single Family" },
                  { name: "rentalHomeType.Apartment", label: "Apartment" },
                  { name: "rentalHomeType.Basement Apartment", label: "Basement" },
                ]}
                register={register}
                type="search"
              />
            )}
            {inputs.includes("homeType") && (
              <CheckBoxInput
                text="Home Type"
                options={[
                  { name: "homeType.Condominium", label: "Condominium" },
                  { name: "homeType.Single Family", label: "Single Family" },
                  { name: "homeType.Apartment", label: "Apartment" },
                ]}
                register={register}
                type="search"
              />
            )}
            {inputs.includes("eventType") && (
              <CheckBoxInput
                text="Event Type"
                options={[
                  { name: "eventType.Music", label: "Music" },
                  { name: "eventType.Comedy", label: "Comedy" },
                  { name: "eventType.Workshop", label: "Workshop" },
                  { name: "eventType.Bollywood", label: "Bollywood" },
                  { name: "eventType.Cultural", label: "Cultural" },
                ]}
                register={register}
                type="search"
              />
            )}
          </div>
        )}

        {/* Search Button */}
        <div className={!isModal ? "md:ml-auto" : "mt-6"}>
          <SearchButton
            textVisible={true}
            paddingClass={"rounded-xl px-10 py-3 w-full md:w-auto flex justify-center"}
            imageClass={"hidden"}
          />
        </div>
      </div>

      {/* Mobile-only Checkboxes row (for Modal) */}
      {isModal && (inputs.includes("type") || inputs.includes("eventType") || inputs.includes("homeType")) && (
        <div className="pt-2 border-t border-gray-100">
          {inputs.includes("type") && (
            <CheckBoxInput
              text="Type"
              options={[
                { name: "rentalHomeType.Condo", label: "Condominium" },
                { name: "rentalHomeType.Single family Home", label: "Single Family" },
                { name: "rentalHomeType.Apartment", label: "Apartment" },
                { name: "rentalHomeType.Basement Apartment", label: "Basement" },
              ]}
              register={register}
              type="search"
            />
          )}
          {inputs.includes("homeType") && (
            <CheckBoxInput
              text="Home Type"
              options={[
                { name: "homeType.Condominium", label: "Condominium" },
                { name: "homeType.Single Family", label: "Single Family" },
                { name: "homeType.Apartment", label: "Apartment" },
              ]}
              register={register}
              type="search"
            />
          )}
          {inputs.includes("eventType") && (
            <CheckBoxInput
              text="Event Type"
              options={[
                { name: "eventType.Music", label: "Music" },
                { name: "eventType.Comedy", label: "Comedy" },
                { name: "eventType.Workshop", label: "Workshop" },
                { name: "eventType.Bollywood", label: "Bollywood" },
                { name: "eventType.Cultural", label: "Cultural" },
              ]}
              register={register}
              type="search"
            />
          )}
        </div>
      )}


    </div>
  );

  if (isMobile) {
    return (
      <div 
        className="w-full relative rounded-tr-2xl rounded-b-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        {/* Placeholder Bar on Page - Styled like desktop bar container */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-5 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <SearchIcon className="text-blue-600" />
          <div className="flex-1 min-w-0">
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">Search Filters</div>
            <div className="text-gray-800 font-bold text-sm truncate flex items-center gap-1">
              <span className="truncate">{watch("location") || "Anywhere"}</span>
              {inputs.includes("makeAndModel") && (watch("make") || watch("model")) && (
                <>
                  <span className="text-gray-300 mx-1">|</span>
                  <span className="text-blue-600 truncate">
                    {[
                      typeof watch("make") === 'object' ? (watch("make")?.make || watch("make")?.name) : watch("make"),
                      typeof watch("model") === 'object' ? (watch("model")?.model || watch("model")?.name) : watch("model")
                    ].filter(Boolean).join(" ")}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
            Edit
          </div>
        </div>

        {/* Mobile Modal */}
        <Dialog
          fullScreen
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#f9fafb"
            }
          }}
        >
          <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'gray.800', boxShadow: 'none', borderBottom: '1px solid #e5e7eb' }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setIsModalOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1, fontWeight: 700, fontFamily: 'DM Sans' }} variant="h6" component="div">
                Search Filters
              </Typography>
              <button 
                onClick={handleSubmit(handleMobileSubmit)}
                className="text-blue-700 font-bold text-sm"
              >
                Done
              </button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <form onSubmit={handleSubmit(handleMobileSubmit)}>
              {renderSearchContent(true)}
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-5 w-full relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      {renderSearchContent(false)}
    </form>
  );
}

export default SearchFieldInput;
