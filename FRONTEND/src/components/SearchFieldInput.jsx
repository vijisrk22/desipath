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
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [priceBounds, setPriceBounds] = useState([0, 10000]);

  // Sync form with Redux active filters
  const rentalHomesState = useSelector((state) => state.rentalHomes);
  const lastSearchQuery = rentalHomesState?.lastSearchQuery;

  const [hasAutoSearched, setHasAutoSearched] = useState(false);

  useEffect(() => {
    // 1. Sync from Redux (lastSearchQuery)
    if (lastSearchQuery) {
      if (title === "Rent a Home") {
        if (lastSearchQuery.city || lastSearchQuery.state || lastSearchQuery.zipcode) {
          const locParts = [lastSearchQuery.city, lastSearchQuery.state, lastSearchQuery.zipcode].filter(Boolean);
          const newLoc = locParts.join(", ");
          if (watch("location") !== newLoc) {
            setValue("location", newLoc);
          }
        }
        // Sync Price
        if (lastSearchQuery.priceMin !== undefined && lastSearchQuery.priceMax !== undefined) {
          if (priceRange[0] !== lastSearchQuery.priceMin || priceRange[1] !== lastSearchQuery.priceMax) {
            setPriceRange([lastSearchQuery.priceMin, lastSearchQuery.priceMax]);
          }
        }
        // Sync Types
        const rentalTypes = ["Condo", "Single family Home", "Apartment", "Basement Apartment"];
        rentalTypes.forEach(type => {
          const isChecked = lastSearchQuery.rentalHomeType?.includes(type);
          if (watch(`rentalHomeType.${type}`) !== isChecked) {
            setValue(`rentalHomeType.${type}`, isChecked); 
          }
        });
      }
      return;
    }

    // 2. If no Redux query, check localStorage for session location
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation && !hasAutoSearched) {
      setValue("location", savedLocation);
      // Automatically trigger search ONCE
      setHasAutoSearched(true);
      handleSubmit(onSubmit)();
    }
  }, [lastSearchQuery, title, setValue, handleSubmit, hasAutoSearched]);

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
        location: data?.location || "",
        carMake: data?.make ? data?.make : "",
        carModel: data?.model ? data?.model : "",
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
  };

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-5 w-full relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      {/* Top Row / Main Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 justify-between">
        
        {/* Left Section: Inputs (Location, Make/Model) */}
        <div className="w-full md:flex-1 max-w-xl flex flex-col gap-2">
          {inputs.includes("location") && (
            <LocationAutocompleteInput
              control={control}
              setValue={setValue}
              type="search"
              onSelect={handleLocationSelect}
            />
          )}
          
          {inputs.includes("makeAndModel") && (
            <div className="flex gap-3">
               <div className="flex-1">
                 <CarMakeModelInput
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    type="search"
                    onlyMake={true}
                  />
               </div>
               <div className="flex-1">
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
        </div>

        {/* Price Slider Section */}
        <div className="w-full md:w-[350px] lg:w-[400px]">
          <MinimumDistanceSlider
            value={priceRange}
            onChange={setPriceRange}
            minRange={priceBounds[0]}
            maxRange={priceBounds[1]}
          />
        </div>

        {/* Search Button */}
        <div className="w-full md:w-auto">
          <SearchButton
            textVisible={true}
            paddingClass={"rounded-xl px-10 py-3 w-full md:w-auto flex justify-center"}
            imageClass={"hidden"}
          />
        </div>
      </div>

      {/* Bottom Row: Checkboxes (if any) */}
      {(inputs.includes("type") || inputs.includes("eventType") || inputs.includes("homeType")) && (
        <div className="pt-2 border-t border-gray-50">
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
    </form>
  );
}

export default SearchFieldInput;
