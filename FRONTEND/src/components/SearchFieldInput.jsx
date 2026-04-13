import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "./InputTemplate/LocationAutocompleteInput";
import MinimumDistanceSlider from "./PriceRangeSlider";
import SearchButton from "./SearchButton";

import { searchRoom } from "../store/RoommatesSlice";
import { searchCar } from "../store/CarsSlice";
import { searchRentalHome } from "../store/RentalHomesSlice";
import { searchHouse } from "../store/HousesSlice";

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
  const [priceRange, setPriceRange] = useState([1000, 10000]);

  // Sync form with Redux active filters
  const rentalHomesState = useSelector((state) => state.rentalHomes);
  const lastSearchQuery = rentalHomesState?.lastSearchQuery;

  useEffect(() => {
    if (!lastSearchQuery) return;
    if (title !== "Rent a Home") return;

    // Sync Location
    if (lastSearchQuery.city || lastSearchQuery.state || lastSearchQuery.zipcode) {
      // Reconstruct location string if possible or just rely on what's there if it matches?
      // Issue: We don't know the exact string user typed vs parsed. 
      // But if we clear it, we should clear the input.
      const locParts = [lastSearchQuery.city, lastSearchQuery.state, lastSearchQuery.zipcode].filter(Boolean);
      // If all empty, clear location
      if (locParts.length === 0) setValue("location", "");
    } else {
      // If query has NO location data, clear input
      setValue("location", "");
    }

    // Sync Price - Update local state
    if (lastSearchQuery.priceMin !== undefined && lastSearchQuery.priceMax !== undefined) {
      setPriceRange([lastSearchQuery.priceMin, lastSearchQuery.priceMax]);
    }

    // Sync Type
    // Loop through all known types and set them based on inclusion in lastSearchQuery.rentalHomeType
    const allTypes = ["Condo", "Single family Home", "Apartment", "Basement Apartment"];
    allTypes.forEach(type => {
      const isChecked = lastSearchQuery.rentalHomeType?.includes(type);
      setValue(`rentalHomeType.${type}`, isChecked); // CheckBoxInput uses "rentalHomeType.Condo" etc.
    });

  }, [lastSearchQuery, title, setValue]);

  useEffect(() => {
    setPriceRange([
      1000,
      title === "Find a Room"
        ? 10000
        : title === "Buy a Car"
          ? 100000
          : title === "Rent a Home"
            ? 15000
            : title === "Buy a home"
              ? 5000000
              : 10000,
    ]);
  }, []);

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
      };
      try {
        console.log("Sending searchQuery:", searchQuery);
        await dispatch(searchHouse({ searchQuery })).unwrap();
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
      className="px-6 py-4 md:py-6 w-[90%] relative rounded-tr-2xl rounded-b-2xl bg-white flex flex-col gap-y-4  md:flex-row md:gap-12  md:items-center md:justify-around "
    >
      <div className="lg:min-w-[400px] xl:min-w-[600px] flex items-center justify-between gap-12 flex-1 flex-wrap">
        {inputs.map((input, index) => (
          <div key={index} className="flex-1">
            {input === "location" ? (
              <LocationAutocompleteInput
                key={index}
                control={control}
                setValue={setValue}
                type="search"
                onSelect={handleLocationSelect}
              />
            ) : input === "makeAndModel" ? (
              <CarMakeModelInput
                key={index}
                control={control}
                watch={watch}
                setValue={setValue}
                type="search"
              />
            ) : input === "type" ? (
              <CheckBoxInput
                text="Type"
                options={[
                  { name: "rentalHomeType.Condo", label: "Condominium" },
                  {
                    name: "rentalHomeType.Single family Home",
                    label: "Single Family ",
                  },
                  { name: "rentalHomeType.Apartment", label: "Apartment" },
                  {
                    name: "rentalHomeType.Basement Apartment",
                    label: "Basement Apartment",
                  },
                ]}
                register={register}
                type="search"
              />
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex gap-4 md:gap-6">
        <div className="w-full lg:min-w-[300px] xl:w-[400px]">
          <MinimumDistanceSlider
            value={priceRange}
            onChange={setPriceRange}
            minRange={priceRange[0]}
            maxRange={priceRange[1]}
          />
        </div>

        <SearchButton
          textVisible={false}
          paddingClass={"rounded-full px-4 py-2 md:px-7 md:py-3"}
          imageClass={"w-6 h-6 md:w-8 md:h-8"}
        />
      </div>
    </form>
  );
}

export default SearchFieldInput;
