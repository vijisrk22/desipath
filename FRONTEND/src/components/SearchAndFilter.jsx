import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchButton from "./SearchButton";
import { Autocomplete, TextField, Box, IconButton, Dialog, DialogContent, Slide, AppBar, Toolbar, Typography } from "@mui/material";
import { Edit as EditIcon, Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  { label: "Astrology", path: "/astrologer/find" },
  { label: "Local Deals", path: "/services/Localdeals" },
  { label: "Photography", path: "/services/photography" },
  { label: "Immigration", path: "/services/immigration" },
  { label: "Jobs", path: "/services/jobs" },
];

const phrases = [
  <>Connecting desi hearts across{" "}<span className="mx-1.5 border-b-4 border-[#ffa41c]">every</span>{" "}zip code</>,
  <>Built{" "}<span className="mx-1.5 border-b-4 border-[#0857d0]">by</span>{" "}desis,{" "}<span className="mx-1.5 border-b-4 border-[#0857d0]">for</span>{" "}desis</>
];

function SearchAndFilter({ initialLocation = "", onEditLocation, onClearLocation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));



  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (selectedCategory && selectedCategory.path) {
      navigate(selectedCategory.path);
    } else {
      navigate("/services/rentalhomes");
    }
    if (isModalOpen) setIsModalOpen(false);
  };

  const renderMobileSearchBar = () => (
    <div 
      onClick={() => setIsModalOpen(true)}
      className="flex items-center bg-white border rounded-full border-gray-200 w-full max-w-md p-3 shadow-sm cursor-pointer gap-3"
    >
      <SearchIcon className="text-blue-600" />
      <div className="flex-1 text-gray-500 font-medium text-sm">
        {selectedCategory ? `Searching in ${selectedCategory.label}` : "What are you looking for?"}
      </div>
      <div className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
        {initialLocation || "Anywhere"}
      </div>
    </div>
  );

  const renderSearchFields = (isModal = false) => (
    <div className={`flex flex-col gap-4 ${!isModal ? "md:flex-row md:items-center w-full" : ""}`}>
      <div className={`flex flex-col md:flex-row justify-start items-center w-full ${!isModal ? "md:h-full" : "gap-4"}`}>
        <div className={`flex items-center px-4 border rounded-[15px] md:rounded-none md:border-y-0 md:border-l-0 md:border-r border-gray-200 w-full ${!isModal ? "md:w-[60%] h-[50px] md:h-[34px]" : "h-[50px]"}`}>
          <input
            type="text"
            placeholder="Zipcode/City"
            value={initialLocation}
            onClick={onEditLocation}
            autoComplete="off"
            className="w-full text-gray-800 text-sm font-semibold font-dmsans outline-none placeholder:text-gray-600 truncate cursor-pointer"
            readOnly
          />
          {initialLocation && (
            <IconButton 
              size="small" 
              onClick={onClearLocation}
              sx={{ color: '#ccc', '&:hover': { color: '#ef4444' } }}
            >
              <CloseIcon sx={{ fontSize: '16px' }} />
            </IconButton>
          )}
          <IconButton size="small" onClick={onEditLocation} sx={{ color: '#999', '&:hover': { color: '#ffa41c' } }}>
            <EditIcon sx={{ fontSize: '16px' }} />
          </IconButton>
        </div>

        <Box className={`flex-1 w-full border rounded-[15px] md:rounded-none md:border-none border-gray-200 ${!isModal ? "h-[50px] md:h-full flex items-center" : "h-[50px] flex items-center"}`}>
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
                placeholder="Select Category"
                variant="standard"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  sx: {
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#4b5563',
                    padding: '0 16px !important'
                  }
                }}
              />
            )}
          />
        </Box>
      </div>

      <div className={`w-full ${!isModal ? "md:w-auto" : ""}`}>
        <button
          type="submit"
          className="w-full md:w-auto bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold py-3 px-8 rounded-[15px] md:rounded-full transition-all flex items-center justify-center gap-2"
        >
          <img src="/search.svg" className="size-5 brightness-0 invert" alt="Search icon" />
          <span className="text-sm md:text-base">Go</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className=" py-4 max-w-4xl flex-col justify-start items-center gap-6 flex w-full mx-auto px-4 sm:px-0">
      <div
        className={`text-center text-gray-800 text-[15px] sm:text-[18px] md:text-[22px] lg:text-[26px] font-medium leading-snug tracking-wide min-h-[52px] flex items-center justify-center flex-wrap gap-x-0 transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {phrases[phraseIndex]}
      </div>

      {isMobile ? (
        <>
          {renderMobileSearchBar()}
          <Dialog
            fullScreen
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            TransitionComponent={Transition}
            sx={{ "& .MuiDialog-paper": { backgroundColor: "#f9fafb" } }}
          >
            <AppBar sx={{ position: 'relative', bgcolor: 'white', color: 'gray.800', boxShadow: 'none', borderBottom: '1px solid #e5e7eb' }}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={() => setIsModalOpen(false)}>
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1, fontWeight: 700, fontFamily: 'DM Sans' }} variant="h6">
                  Search
                </Typography>
                <button onClick={handleSearch} className="text-blue-700 font-bold text-sm">
                  Search
                </button>
              </Toolbar>
            </AppBar>
            <DialogContent className="pt-6">
              <form onSubmit={handleSearch}>
                {renderSearchFields(true)}
              </form>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <form 
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row bg-white border rounded-[20px] md:rounded-full border-gray-200 w-full max-w-md md:max-w-2xl p-[6px] shadow-sm hover:shadow-md transition-shadow items-center gap-2 md:gap-0"
        >
          {renderSearchFields(false)}
        </form>
      )}
    </div>
  );
}

export default SearchAndFilter;
