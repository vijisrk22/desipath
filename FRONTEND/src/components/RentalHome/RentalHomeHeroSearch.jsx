import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchRentalHome } from "../../store/RentalHomesSlice";
import { useForm } from "react-hook-form";
import SearchIcon from '@mui/icons-material/Search';
import LocationSelectorModal from "../LocationSelectorModal";

function RentalHomeHeroSearch({ location }) {
  const dispatch = useDispatch();
  const { control, setValue, watch, handleSubmit } = useForm();

  const [priceMax, setPriceMax] = useState("Any");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedLocation = watch("location");

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      setValue("location", savedLocation);
      triggerSearch(savedLocation, priceMax, selectedTypes);
    } else {
      setIsModalOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      setValue("location", location);
    }
  }, [location, setValue]);

  const handleLocationSelect = (loc) => {
    setValue('location', loc);
    localStorage.setItem('user_location', loc);
    setIsModalOpen(false);
    triggerSearch(loc, priceMax, selectedTypes);
  };

  const propertyTypes = ["Condominium", "Single Family", "Apartment", "Basement"];

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const triggerSearch = (locationInput, priceMaxInput, typesInput) => {
    const loc = locationInput || "";
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

    const priceMaxVal = priceMax === "Any" ? 15000 : parseInt(priceMax);

    const searchQuery = {
      city,
      state,
      zipcode,
      priceMin: 0,
      priceMax: priceMaxVal,
      rentalHomeType: selectedTypes,
    };

    dispatch(searchRentalHome({ searchQuery }));
  };

  const onSubmit = (data) => {
    triggerSearch(data.location, priceMax, selectedTypes);
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
          Find Your Perfect Rental
        </h1>
        <p className="text-white/90 text-base md:text-lg font-medium font-dmsans mb-1 drop-shadow">
          Browse verified rental homes, apartments, and basements.
        </p>
        <p className="text-white/80 text-sm font-dmsans mb-6 drop-shadow max-w-2xl hidden md:block">
          Discover properties matching your exact location and monthly budget.
        </p>

        {/* Search Bar Container */}
        <div className="w-full bg-white rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3 relative z-20">
          
          <div 
            className="w-full md:w-1/3 md:border-r border-gray-200 px-2 md:pl-4 relative flex items-center"
            onClick={() => setIsModalOpen(true)}
          >
            <SearchIcon className="text-gray-400 absolute left-4" />
            <input
              type="text"
              readOnly
              value={selectedLocation || ""}
              placeholder="City, State, ZIP"
              className="w-full h-12 bg-transparent text-gray-700 font-dmsans font-medium outline-none cursor-pointer pl-10"
              onFocus={(e) => {
                e.target.blur();
                setIsModalOpen(true);
              }}
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
              <option value="1500">Under $1,500/mo</option>
              <option value="2500">Under $2,500/mo</option>
              <option value="3500">Under $3,500/mo</option>
              <option value="5000">Under $5,000/mo</option>
            </select>
          </div>

          <button 
            onClick={handleSubmit(onSubmit)}
            className="w-full md:w-auto bg-[#1565D8] hover:bg-[#1152b3] text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold font-dmsans transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap ml-auto"
          >
            <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Search Rentals
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

      {isModalOpen && (
        <LocationSelectorModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleLocationSelect}
          buttonLabel="Search"
        />
      )}
    </div>
  );
}

export default RentalHomeHeroSearch;
