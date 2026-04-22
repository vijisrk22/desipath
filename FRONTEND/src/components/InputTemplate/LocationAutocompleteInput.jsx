import { useEffect, useRef, useState } from "react";
import TextFieldInput from "./TextFieldInput";
import { Paper, MenuItem, CircularProgress, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import api from "../../utils/api";
import { MdMyLocation } from "react-icons/md";

function LocationAutocompleteInput({
  control,
  setValue,
  defaultLocation,
  type = "",
  onSelect,
}) {
  const wrapperRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const input = useWatch({ control, name: "location" }) || "";

  // Debounce the input to avoid api calls on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only set debounce if it's different and not just a single char
      // Also, if the input exactly matches a selected location (implied by user selection), we might want to skip searching? 
      // But keeping it simple: just debounce whatever text is there.
      setDebouncedSearch(input);
    }, 300);

    return () => clearTimeout(handler);
  }, [input]);

  const { data: suggestions = [], isLoading, isFetching, isError, error } = useQuery(
    ["locations", debouncedSearch],
    async () => {
      // Don't search if empty or too short
      if (!debouncedSearch || debouncedSearch.length < 2) return [];

      // If the input matches the last selected format exactly, maybe avoid search?
      // For now, let's just search. The cache will handle repeats instantly.
      const parts = debouncedSearch.split(",").map((p) => p.trim());
      const searchTerm = parts[parts.length - 1]; // Search based on the last part (like "New York, N")

      if (searchTerm.length < 2) return [];

      const res = await api.get(`/api/location/locations?filter=${searchTerm}`);
      return res.data.map(
        (loc) => `${loc.city}, ${loc.state_name}, ${loc.zip}`
      );
    },
    {
      enabled: debouncedSearch.length >= 2,
      staleTime: 60 * 1000, // 1 minute cache
      keepPreviousData: true,
      retry: false,
    }
  );

  useEffect(() => {
    if (debouncedSearch.length >= 2 && debouncedSearch !== selectedLocation && !isDropdownOpen) {
      // Open dropdown when we have a valid search term
      setIsDropdownOpen(true);
    } else if (debouncedSearch.length < 2) {
      setIsDropdownOpen(false);
    }
  }, [debouncedSearch]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await api.get(`/api/location/reverse?lat=${latitude}&lng=${longitude}`);
            const loc = res.data;
            if (loc) {
              const formatted = `${loc.city}, ${loc.state_name}, ${loc.zip}`;
              setValue("location", formatted);
              setSelectedLocation(formatted);
              setIsDropdownOpen(false); // Close dropdown after selection
            }
          } catch (error) {
            console.error("Geolocation error:", error);
          }
        },
        (error) => {
          console.error("Geolocation permission denied or error:", error);
        }
      );
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter existing suggestions based on current input to refine results locally if needed
  // (React Query returns fetched data; we can further filter if we want to mimic the old behavior of multi-term matching)
  // For now, let's use the fetched logic directly as it matches the old implementation's intent.
  // Actually, the old implementation filtered the *cached* results again by all parts.
  // Let's rely on the API returning relevant results for the last term, which is the primary use case.


  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {type === "search" ? (
        // Custom UI for 'search' input
        <div className="px-4 py-2 sm:py-3 rounded-[30px] bg-white text-md md:text-sm lg:text-base border border-gray-200 shadow-sm flex w-full items-center">
          <input
            name="location"
            autoComplete="off"
            placeholder="City, State, Zip"
            value={input}
            onChange={(e) => setValue("location", e.target.value)}
            className="outline-none px-1 py-1  flex-1 min-w-0 rounded-lg"
          />
          <MdMyLocation
            className="cursor-pointer text-gray-500 hover:text-blue-500 ml-2"
            onClick={handleGeolocation}
            title="Use my current location"
          />
        </div>
      ) : (
        // Default TextFieldInput
        <TextFieldInput
          name="location"
          control={control}
          defaultValue="City, State, Zip"
          text="Location"
          customProps={{
            autoComplete: "off",
            InputProps: {
              endAdornment: (
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleGeolocation}>
                  <MdMyLocation style={{ color: '#757575' }} />
                </div>
              )
            }
          }}
        />
      )}

      {isDropdownOpen && (debouncedSearch.length >= 2) && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "80%",
            left: 0,
            width: "100%",
            zIndex: 999,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {isLoading && (
            <div className="p-3 flex items-center justify-center text-gray-500">
              <CircularProgress size={20} className="mr-2" />
              <Typography variant="body2">Loading...</Typography>
            </div>
          )}

          {!isLoading && isError && (
            <div className="p-3 text-center text-red-500">
              <Typography variant="body2">Error: {error?.message}</Typography>
              {error?.response && <Typography variant="caption" display="block">{error.response.status} {error.response.statusText}</Typography>}
            </div>
          )}

          {!isLoading && !isError && suggestions.length === 0 && (
            <div className="p-3 text-center text-gray-500">
              <Typography variant="body2">No locations found</Typography>
            </div>
          )}

          {!isLoading && suggestions.map((s, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setValue("location", s);
                setSelectedLocation(s);
                setIsDropdownOpen(false);
                if (onSelect) onSelect(s);
              }}
              sx={{
                fontSize: {
                  md: "0.7rem", // medium
                  lg: "1.125rem", // large
                },
              }}
            >
              {s}
            </MenuItem>
          ))}
        </Paper>
      )}
    </div>
  );
}

export default LocationAutocompleteInput;
