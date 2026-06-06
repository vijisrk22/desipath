import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchCar, getCarMake } from "../../store/CarsSlice";
import LocationAutocompleteInput from "../InputTemplate/LocationAutocompleteInput";
import { useForm } from "react-hook-form";
import SearchIcon from '@mui/icons-material/Search';

function BuyCarHero() {
  const dispatch = useDispatch();
  const { control, setValue, watch, handleSubmit } = useForm();
  
  const { car_make, loading } = useSelector((state) => state.cars);
  const [priceMax, setPriceMax] = useState("Any");
  const [selectedMake, setSelectedMake] = useState("");

  const popularMakes = ["Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Nissan", "Tesla", "Hyundai"];

  // Fetch makes on mount
  useEffect(() => {
    dispatch(getCarMake()).unwrap().catch(err => console.error("Error fetching makes:", err));
  }, [dispatch]);

  const selectMake = (make) => {
    const newMake = selectedMake === make ? "" : make;
    setSelectedMake(newMake);
    
    // Automatically submit search on chip click
    const formValues = watch();
    triggerSearch(formValues.location, newMake, priceMax);
  };

  const triggerSearch = (locationInput, makeInput, priceMaxInput) => {
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

    const priceMaxVal = priceMaxInput === "Any" ? 100000 : parseInt(priceMaxInput);

    const searchQuery = {
      city,
      state,
      zipcode,
      location: loc,
      carMake: makeInput || "",
      carModel: "", // Reset model on make-level search from hero
      priceMin: 0,
      priceMax: priceMaxVal,
    };

    dispatch(searchCar(searchQuery));
  };

  const onSubmit = (data) => {
    triggerSearch(data.location, selectedMake, priceMax);
  };

  // Process makes options
  const makeOptions = (car_make && car_make.length > 0)
    ? car_make.map((m) => (typeof m === 'object' ? (m.make || m.name) : m))
    : [];

  return (
    <div className="relative w-full h-[300px] md:h-[360px] bg-gradient-to-b from-blue-900 to-blue-950 flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
        style={{ backgroundImage: "url('/img/cars/backgroundCarImg.png')" }}
      />

      <div className="relative z-10 w-full max-w-5xl px-6 md:px-8 text-center flex flex-col items-center">
        <h1 className="text-white text-3xl md:text-5xl font-bold font-dmsans tracking-tight leading-tight mb-2 drop-shadow-md">
          Find Your Dream Car
        </h1>
        <p className="text-white/90 text-base md:text-lg font-medium font-dmsans mb-1 drop-shadow">
          Browse verified car listings in your area.
        </p>
        <p className="text-white/80 text-sm font-dmsans mb-6 drop-shadow max-w-2xl hidden md:block">
          Discover sedans, SUVs, trucks, and electric vehicles within your preferred budget.
        </p>

        {/* Search Bar Container */}
        <div className="w-full bg-white rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3">
          
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
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
              }}
            >
              <option value="">Select Make</option>
              {makeOptions.map(make => (
                <option key={make} value={make}>{make}</option>
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
              <option value="10000">Under $10K</option>
              <option value="20000">Under $20K</option>
              <option value="30000">Under $30K</option>
              <option value="50000">Under $50K</option>
              <option value="100000">Under $100K</option>
            </select>
          </div>

          <button 
            onClick={handleSubmit(onSubmit)}
            className="w-full md:w-auto bg-[#1565D8] hover:bg-[#1152b3] text-white px-8 py-3.5 rounded-xl md:rounded-full font-bold font-dmsans transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group whitespace-nowrap ml-auto"
          >
            <SearchIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Search Cars
          </button>
        </div>

        {/* Car Make Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8 w-full max-w-4xl">
          {popularMakes.map(make => (
            <button
              key={make}
              onClick={() => selectMake(make)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-dmsans transition-all duration-300 border backdrop-blur-sm shadow-sm hover:-translate-y-0.5 ${
                selectedMake === make
                  ? "bg-[#1565D8] border-[#1565D8] text-white shadow-md"
                  : "bg-white/95 border-transparent text-gray-700 hover:bg-white"
              }`}
            >
              {make}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default BuyCarHero;
