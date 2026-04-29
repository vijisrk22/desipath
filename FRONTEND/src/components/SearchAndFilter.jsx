import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchButton from "./SearchButton";
import { Autocomplete, TextField, Box, IconButton } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const categories = [
  { label: "Rental home", path: "/services/rentalhomes" },
  { label: "Buy/Sell Cars", path: "/services/cars" },
  { label: "Kids class", path: "/kids-class" },
  { label: "Buy Sell Home", path: "/services/BuyHome" },
  { label: "Travel Companion", path: "/travel-companion" },
  { label: "Events", path: "/services/events" },
  { label: "Roommates", path: "/services/roommates" },
  { label: "IT Trainings", path: "/services/itTrainings" },
  { label: "Lawyers", path: "/services/lawyers" },
  { label: "Doctors", path: "/services/doctors" },
  { label: "Astrology", path: "/services/astrologyAds" },
  { label: "Local Ads", path: "/services/localAds" },
  { label: "Photography", path: "/services/photography" },
  { label: "Immigration", path: "/services/immigration" },
  { label: "Jobs", path: "/services/jobs" },
];

const phrases = [
  <>Connecting desi hearts across <span className="mx-3 border-b-4 border-[#ffa41c]">every</span> zip code</>,
  <>Built <span className="mx-3 border-b-4 border-[#0857d0]">by</span> desis, <span className="mx-3 border-b-4 border-[#0857d0]">for</span> desis</>
];

function SearchAndFilter({ initialLocation = "", onEditLocation }) {
  const [location, setLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 1000); // Wait for fade out before switching
    }, 6000); // Cycle every 6 seconds for a slow feel
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
    }
  }, [initialLocation]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (selectedCategory && selectedCategory.path) {
      navigate(selectedCategory.path);
    } else {
      // Fallback if no category selected
      navigate("/services/rentalhomes");
    }
  };

  return (
    <div className=" py-4 max-w-4xl flex-col justify-start items-center gap-6 flex w-full mx-auto px-4 sm:px-0">
      <div className={`text-center text-gray-800 text-[16px] xs:text-[18px] sm:text-[20px] md:text-[24px] lg:text-[26px] font-medium md:leading-[38px] tracking-wide min-h-[60px] flex items-center justify-center transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
        {phrases[phraseIndex]}
      </div>

      <form 
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row bg-white border rounded-[20px] md:rounded-full border-gray-200 w-full max-w-md md:max-w-2xl p-[6px] shadow-sm hover:shadow-md transition-shadow items-center gap-2 md:gap-0"
      >
        <div className="flex-1 flex flex-col md:flex-row justify-start items-center w-full md:h-full">
          {/* Location Input with Edit Button */}
          <div className="flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 w-full md:w-[60%] h-[50px] md:h-[34px]">
            <input
              type="text"
              placeholder="Zipcode/City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-gray-800 text-sm font-semibold font-dmsans outline-none placeholder:text-gray-400 truncate"
            />
            <IconButton 
              size="small" 
              onClick={onEditLocation}
              sx={{ 
                ml: 0.5, 
                color: '#999',
                '&:hover': { color: '#ffa41c' }
              }}
            >
              <EditIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          </div>

          {/* Category Autocomplete */}
          <Box className="flex-1 w-full h-[50px] md:h-full flex items-center">
            <Autocomplete
              fullWidth
              options={categories}
              getOptionLabel={(option) => option.label}
              value={selectedCategory}
              disableClearable
              onChange={(event, newValue) => {
                setSelectedCategory(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search classes, cars, homes..."
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    sx: {
                      fontSize: { xs: '14px', sm: '14px' },
                      fontWeight: 600,
                      fontFamily: 'DM Sans, sans-serif',
                      color: '#4b5563',
                      '& input': {
                        padding: '0 !important',
                        height: '100%'
                      }
                    }
                  }}
                />
              )}
              sx={{
                '& .MuiAutocomplete-inputRoot': {
                  padding: '4px 16px 0 !important', // Added top padding to shift text down to the middle
                  minHeight: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                },
                '& .MuiAutocomplete-endAdornment': {
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)' // Perfectly center the arrow vertically
                }
              }}
              ListboxProps={{
                sx: {
                  fontFamily: 'DM Sans, sans-serif',
                  '& .MuiAutocomplete-option': {
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    py: 1.5
                  }
                }
              }}
            />
          </Box>
        </div>
        <div className="w-full md:w-auto mt-2 md:mt-0">
          <button
            type="submit"
            className="w-full md:w-auto bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold py-3 md:py-3 px-8 rounded-[15px] md:rounded-full transition-all flex items-center justify-center gap-2"
          >
            <img src="/search.svg" className="size-5 brightness-0 invert" />
            <span className="text-sm md:text-base">Go</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchAndFilter;
