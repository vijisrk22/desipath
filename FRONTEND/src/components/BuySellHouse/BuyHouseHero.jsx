import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { searchHouse } from "../../store/HousesSlice";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import { useForm } from "react-hook-form";
import SearchIcon from '@mui/icons-material/Search';

function BuyHouseHero() {
  const dispatch = useDispatch();
  const { control, setValue, watch, handleSubmit } = useForm();

  const [priceMax, setPriceMax] = useState("Any");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const propertyTypes = ["Condominium", "Single Family", "Apartment", "Townhouse", "Multi-Family"];

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const onSubmit = (data) => {
    const loc = data.location || "";
    const parts = loc.split(",").map(s => s.trim());
    let city = "", state = "", zipcode = "";

    if (parts.length >= 3) {
      city = parts[0];
      state = parts[1];
      const potentialZip = parts[parts.length - 1];
      if (/^\d{5}(-\d{4})?$/.test(potentialZip) || parts.length === 3) {
        zipcode = parts[2];
      } else {
        // e.g. Princeton, NJ, 08540, USA -> zipcode is parts[2]
        zipcode = parts[2].split(" ")[0];
      }
    } else if (parts.length === 2) {
      city = parts[0];
      const statePart = parts[1];
      const subParts = statePart.split(" ");
      const lastPart = subParts[subParts.length - 1];
      if (/^\d{5}(-\d{4})?$/.test(lastPart)) {
        zipcode = lastPart;
        state = subParts.slice(0, -1).join(" ").trim();
      } else {
        state = statePart;
      }
    } else {
      const singlePart = parts[0] || "";
      const subParts = singlePart.split(" ");
      const lastPart = subParts[subParts.length - 1];
      if (/^\d{5}(-\d{4})?$/.test(lastPart)) {
        zipcode = lastPart;
        city = subParts.slice(0, -1).join(" ").trim();
      } else {
        city = singlePart;
      }
    }

    const priceMaxVal = priceMax === "Any" ? 5000000 : parseInt(priceMax);

    const searchQuery = {
      city,
      state,
      zipcode,
      priceMin: 0,
      priceMax: priceMaxVal,
      houseType: selectedTypes,
    };

    dispatch(searchHouse({ searchQuery }));
  };

  return (
    <div className="relative w-full h-auto min-h-[350px] py-12 md:py-0 md:h-[360px] bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
        style={{ backgroundImage: "url('/modern_rental_home_hero.png')" }}
      />

      <div className="relative z-10 w-full max-w-5xl px-6 md:px-8 text-center flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold font-dmsans tracking-tight leading-tight mb-2 drop-shadow-md">
          Find Your Dream Home
        </h1>
        <p className="text-white/90 text-base md:text-lg font-medium font-dmsans mb-1 drop-shadow">
          Browse verified home listings across the USA and Canada.
        </p>
        <p className="text-white/80 text-sm font-dmsans mb-6 drop-shadow max-w-2xl hidden md:block">
          Discover houses, condos, townhomes, and apartments in your preferred city and budget.
        </p>

        {/* Search Bar Container */}
        <div className="w-full bg-white rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3 relative z-20">
          
          <div className="w-full md:w-1/3 md:border-r border-gray-200 px-2 md:pl-4">
             <LocationAutocompleteInput
                control={control}
                setValue={setValue}
                watch={watch}
                type="search"
                placeholder="City, State, ZIP"
              />
          </div>

          <div className="w-full md:w-1/4 md:border-r border-gray-200 px-2">
            <select 
              className="w-full h-12 bg-transparent text-gray-700 font-dmsans font-medium outline-none cursor-pointer"
              onChange={(e) => {
                if(e.target.value) {
                  setSelectedTypes([e.target.value]);
                } else {
                  setSelectedTypes([]);
                }
              }}
            >
              <option value="">Property Type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-1/4 px-2">
            <select 
              className="w-full h-12 bg-transparent text-gray-700 font-dmsans font-medium outline-none cursor-pointer"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            >
              <option value="Any">Any Price</option>
              <option value="250000">Under $250K</option>
              <option value="500000">Under $500K</option>
              <option value="1000000">Under $1M</option>
              <option value="5000000">$1M+</option>
            </select>
          </div>

          <button 
            onClick={handleSubmit(onSubmit)}
            className="w-full md:w-auto bg-[#1565D8] hover:bg-[#1152b3] text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold font-dmsans transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap ml-auto"
          >
            <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Search Homes
          </button>
        </div>

        {/* Property Type Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full max-w-4xl">
          {propertyTypes.map(type => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-dmsans transition-all duration-300 border backdrop-blur-sm shadow-sm hover:-translate-y-0.5 ${
                selectedTypes.includes(type)
                  ? "bg-[#1565D8] border-[#1565D8] text-white shadow-md"
                  : "bg-white/95 border-transparent text-gray-700 hover:bg-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default BuyHouseHero;
