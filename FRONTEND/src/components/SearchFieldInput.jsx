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

  useEffect(() => {
    if (!lastSearchQuery) return;
    if (title !== "Rent a Home") return;

    // Sync Location
    if (lastSearchQuery.city || lastSearchQuery.state || lastSearchQuery.zipcode) {
      const locParts = [lastSearchQuery.city, lastSearchQuery.state, lastSearchQuery.zipcode].filter(Boolean);
      if (locParts.length === 0) setValue("location", "");
    } else {
      setValue("location", "");
    }

    // Sync Price - Update local state
    if (lastSearchQuery.priceMin !== undefined && lastSearchQuery.priceMax !== undefined) {
      setPriceRange([lastSearchQuery.priceMin, lastSearchQuery.priceMax]);
    }

    // Sync Rental Home Type
    const rentalTypes = ["Condo", "Single family Home", "Apartment", "Basement Apartment"];
    rentalTypes.forEach(type => {
      const isChecked = lastSearchQuery.rentalHomeType?.includes(type);
      setValue(`rentalHomeType.${type}`, isChecked); 
    });

    // Sync Home Type (Buy House)
    const homeTypes = ["Condominium", "Single Family", "Apartment"];
    homeTypes.forEach(type => {
      const isChecked = lastSearchQuery.homeType?.includes(type);
      setValue(`homeType.${type}`, isChecked);
    });

  }, [lastSearchQuery, title, setValue]);

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
      // Logic: 
      // 1 part: Likely City or Zip (we'll try city first, or search across all)
      // 2 parts: City, State
      // 3 parts: City, State, Zip
      // For now, let's map loosely. 
      // Ideally backend search should handle single string. 
      // But looking at Redux actions, they send structured object. 
      // Let's do best effort mapping.

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
      const searchQuery = {
        location: data?.location ? data?.location : "",
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
