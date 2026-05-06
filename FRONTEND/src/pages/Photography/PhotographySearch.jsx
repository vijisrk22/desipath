import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PhotographerCard from "../../components/Photography/PhotographerCard";
import api from "../../utils/api";
import { 
  CircularProgress, 
  Slider, 
  ToggleButton, 
  ToggleButtonGroup,
  TextField,
  InputAdornment,
  Autocomplete
} from "@mui/material";

export default function PhotographySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [zip, setZip] = useState("");
  const [zipOptions, setZipOptions] = useState([]);
  const [zipInput, setZipInput] = useState("");
  const [radius, setRadius] = useState(100);
  const [type, setType] = useState("Both");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);
  const abortController = useRef(null);

  // Fetch locations for autocomplete
  useEffect(() => {
    if (zipInput.length < 2) {
      setZipOptions([]);
      return;
    }
    const fetchLocations = async () => {
      try {
        const res = await api.get(`/api/location/locations?filter=${zipInput}`);
        setZipOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };
    const timer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timer);
  }, [zipInput]);

  const fetchResults = async (currentTerm, currentZip, currentRadius, currentType) => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    setLoading(true);
    try {
      const res = await api.get("/api/photography/search", {
        params: {
          q: currentTerm,
          zip: currentZip,
          radius: currentRadius,
          type: currentType
        },
        signal: abortController.current.signal
      });
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        console.error("Failed to fetch photography results", err);
      }
    } finally {
      if (!abortController.current.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const debouncedSearch = () => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchResults(searchTerm, zip, radius, type);
    }, 400);
  };

  useEffect(() => {
    fetchResults("", "", 100, "Both");
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (abortController.current) abortController.current.abort();
    };
  }, []);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, zip, radius, type]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#d946ef] py-6 px-[7%] text-white shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black mb-1 font-dmsans">Find Professional Photographers</h1>
          <p className="text-blue-100 mb-4 font-medium">Capture your best moments with top-rated photographers and videographers.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white py-2 px-4 rounded-3xl shadow-2xl items-center">
            <div className="md:col-span-5 relative">
               <TextField
                fullWidth
                placeholder="Search by name or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="text-xl ml-2">🔍</span>
                    </InputAdornment>
                  ),
                  className: "py-2 px-4 text-gray-800 font-medium"
                }}
              />
            </div>

            <div className="md:col-span-3 border-l border-gray-100 pl-4">
              <Autocomplete
                fullWidth
                options={zipOptions}
                getOptionLabel={(option) => `${option.city}, ${option.state_id} ${option.zip}`}
                filterOptions={(x) => x}
                value={zipOptions.find(o => o.zip === zip) || (zip ? { zip, city: '', state_id: '' } : null)}
                onChange={(e, newVal) => {
                  if (newVal) setZip(newVal.zip);
                  else setZip("");
                }}
                onInputChange={(e, newInputValue) => setZipInput(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="City, State or Zip"
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <span className="text-xl">📍</span>
                        </InputAdornment>
                      ),
                      className: "py-2 px-2 text-gray-800 font-medium"
                    }}
                  />
                )}
              />
            </div>

            <div className="md:col-span-4 pl-4 border-l border-gray-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">Radius: {radius} miles</span>
                <Slider
                  value={radius}
                  onChange={(e, val) => setRadius(val)}
                  min={1}
                  max={500}
                  size="small"
                  sx={{ color: '#a855f7' }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-sm font-bold text-blue-100 uppercase tracking-widest">Service Type:</span>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={(e, val) => val && setType(val)}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: '57px',
                padding: '2px',
                '& .MuiToggleButton-root': {
                  color: 'white',
                  border: 'none',
                  borderRadius: '57px !important',
                  px: 3,
                  py: 0.5,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  '&.Mui-selected': {
                    backgroundColor: 'white',
                    color: '#a855f7',
                    '&:hover': { backgroundColor: 'white' }
                  }
                }
              }}
            >
              <ToggleButton value="Photographer">Photographer</ToggleButton>
              <ToggleButton value="Videographer">Videographer</ToggleButton>
              <ToggleButton value="Both">Both</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-[7%] py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <CircularProgress size={60} sx={{ color: '#a855f7' }} />
            <p className="mt-4 text-gray-500 font-bold animate-pulse">Finding the best lenses for you...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((p) => (
              <PhotographerCard key={p.id} photographer={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[40px] shadow-sm border border-dashed border-gray-200">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No photographers found</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Try adjusting your search filters or broadening your radius to find professionals in your area.
            </p>
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
