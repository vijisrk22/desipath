import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchRentalHome } from "../../store/RentalHomesSlice";
import { useForm } from "react-hook-form";
import SearchIcon from '@mui/icons-material/Search';
import LocationSelectorModal from "../LocationSelectorModal";

function RentalHomeHeroSearch({ location }) {
  const dispatch = useDispatch();
  const { setValue, watch, handleSubmit } = useForm();

  const [priceMax, setPriceMax] = useState("Any");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResultCount, setSearchResultCount] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const selectedLocation = watch("location");

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (savedLocation) {
      setValue("location", savedLocation);
      triggerSearch(savedLocation, priceMax, selectedTypes, false);
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
    triggerSearch(loc, priceMax, selectedTypes, true);
  };

  const propertyTypes = ["Condominium", "Single Family", "Apartment", "Basement"];

  const toggleType = (type) => {
    setSelectedTypes(prev => {
      const updated = prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type];
      return updated;
    });
  };

  const triggerSearch = async (locationInput, priceMaxInput, typesInput, shouldScroll = true) => {
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

    const priceEffective = priceMaxInput !== undefined ? priceMaxInput : priceMax;
    const priceMaxVal = priceEffective === "Any" ? 15000 : parseInt(priceEffective);
    const typesEffective = typesInput !== undefined ? typesInput : selectedTypes;

    const searchQuery = {
      city,
      state,
      zipcode,
      priceMin: 0,
      priceMax: priceMaxVal,
      rentalHomeType: typesEffective,
    };

    try {
      const resultAction = await dispatch(searchRentalHome({ searchQuery }));
      const payload = resultAction?.payload;
      const isArray = Array.isArray(payload);
      const total = payload?.total !== undefined
        ? payload.total
        : (isArray ? payload.length : (payload?.data ? payload.data.length : 0));

      setSearchResultCount(total);
      setHasSearched(true);

      // Scroll down to results section if search results are greater than or equal to 1
      if (shouldScroll && total >= 1) {
        setTimeout(() => {
          const resultsElement = document.getElementById("rental-results");
          if (resultsElement) {
            const navbarOffset = -70;
            const elementPosition = resultsElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset + navbarOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth"
            });
            resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 150);
      }
      return total;
    } catch (err) {
      console.error("Search failed:", err);
      return 0;
    }
  };

  const onSubmit = async (data) => {
    setIsSearching(true);
    await triggerSearch(data.location, priceMax, selectedTypes, true);
    setIsSearching(false);
  };

  return (
    <div className="relative w-full h-auto min-h-[350px] py-12 md:py-0 md:h-[380px] bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center">
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
            type="button"
            disabled={isSearching}
            onClick={handleSubmit(onSubmit)}
            className="w-full md:w-auto bg-[#1565D8] hover:bg-[#1152b3] disabled:bg-blue-400 text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold font-dmsans transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap ml-auto cursor-pointer"
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching…
              </span>
            ) : (
              <>
                <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Search Rentals
              </>
            )}
          </button>
        </div>

        {/* Total Results Feedback Banner */}
        {hasSearched && searchResultCount !== null && (
          <div className="mt-4 animate-fade-in inline-flex items-center gap-2 px-5 py-2 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-white/60 text-sm font-semibold font-dmsans text-gray-800">
            {searchResultCount >= 1 ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[#0857D0] font-bold">
                  {searchResultCount} {searchResultCount === 1 ? 'Result Found' : 'Results Found'}
                </span>
                <span className="text-gray-400 text-xs font-normal">•</span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("rental-results");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="text-gray-600 hover:text-[#0857D0] text-xs font-medium underline cursor-pointer"
                >
                  View below ↓
                </button>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-gray-700">0 Results Found — try adjusting your location or filters</span>
              </>
            )}
          </div>
        )}

        {/* Property Type Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 w-full max-w-4xl">
          {propertyTypes.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-dmsans transition-all duration-300 border backdrop-blur-sm shadow-sm hover:-translate-y-0.5 cursor-pointer ${
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
