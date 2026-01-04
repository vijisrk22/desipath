import { useEffect, useRef, useState, useCallback } from "react";
import TextFieldInput from "./TextFieldInput";
import { Paper, MenuItem } from "@mui/material";
import { useWatch } from "react-hook-form";
import debounce from "lodash.debounce";
import axios from "axios";
import api from "../../utils/api";
import { MdMyLocation } from "react-icons/md";

function LocationAutocompleteInput({
  control,
  setValue,
  defaultLocation,
  type = "",
}) {
  const wrapperRef = useRef();
  const cacheRef = useRef({});
  const cancelTokenRef = useRef(null);
  const skipNextEffectRef = useRef(!!defaultLocation);
  const previousInputRef = useRef(""); // NEW: stores previous input

  const input = useWatch({ control, name: "location" }) || "";
  const [suggestions, setSuggestions] = useState([]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await api.get(\`/api/location/reverse?lat=\${latitude}&lng=\${longitude}\`);
            const loc = res.data;
            if (loc) {
                const formatted = \`\${loc.city}, \${loc.state_name}, \${loc.zip}\`;
                setValue("location", formatted);
                previousInputRef.current = formatted;
                skipNextEffectRef.current = true; // Avoid searching again immediately
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

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      const parts = query.split(",").map((p) => p.trim());
      const searchTerm = parts[parts.length - 1];

      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      if (cacheRef.current[searchTerm]) {
        const cachedResults = cacheRef.current[searchTerm];
        const filtered =
          parts.length > 1
            ? cachedResults.filter((item) =>
              item
                .toLowerCase()
                .includes(parts.slice(0, -1).join(", ").toLowerCase())
            )
            : cachedResults;

        setSuggestions(filtered);
        return;
      }

      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Operation canceled due to new request.");
      }
      cancelTokenRef.current = axios.CancelToken.source();

      try {
        const res = await api.get(
          `/ api / location / locations ? filter = ${ searchTerm }`,
          {
            cancelToken: cancelTokenRef.current.token,
          }
        );

        const results = res.data;
        const formatted = results.map(
          (loc) => `${ loc.city }, ${ loc.state_name }, ${ loc.zip }`
        );

        const uniqueSuggestions = [...new Set(formatted)];
        cacheRef.current[searchTerm] = uniqueSuggestions;

        const filtered =
          parts.length > 1
            ? uniqueSuggestions.filter((item) =>
              item
                .toLowerCase()
                .includes(parts.slice(0, -1).join(", ").toLowerCase())
            )
            : uniqueSuggestions;

        setSuggestions(filtered);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching locations:", err);
          setSuggestions([]);
        }
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (skipNextEffectRef.current) {
      skipNextEffectRef.current = false;
      previousInputRef.current = input;
      return;
    }

    if (
      !input ||
      suggestions.includes(input) ||
      input === previousInputRef.current
    ) {
      return;
    }

    previousInputRef.current = input;
    fetchSuggestions(input);
  }, [input, fetchSuggestions, suggestions]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      fetchSuggestions.cancel();
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }
    };
  }, [fetchSuggestions]);

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {type === "search" ? (
        // Custom UI for 'search' input
        <div className="p-2 sm:p-4 md:p-6 rounded-[30px] text-md md:text-sm lg:text-base border border-gray-400 flex  w-full items-center">
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

      {suggestions.length > 0 && (
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
          {suggestions.map((s, idx) => (
            <MenuItem
              key={idx}
              onClick={() => {
                setValue("location", s);
                setSuggestions([]);
                skipNextEffectRef.current = true;
                previousInputRef.current = s;
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
