import React, { useState, useEffect, useRef } from 'react';
import { 
  Paper, 
  MenuItem, 
  CircularProgress, 
  Typography,
  InputBase,
  Box
} from '@mui/material';
import { Search, LocalAirport } from '@mui/icons-material';
import api from '../../utils/api';
import { useQuery } from 'react-query';

const AirportAutocomplete = ({ onSelect, placeholder = "Search city or airport code (e.g. BOM, Chicago)", value }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    if (value) setInputValue(value);
  }, [value]);

  const { data: suggestions = [], isLoading } = useQuery(
    ["airports", debouncedSearch],
    async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      const res = await api.get(`/api/airports/search?q=${debouncedSearch}`);
      return res.data;
    },
    {
      enabled: debouncedSearch.length >= 2,
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    // Only open if the user is typing something different from the current display value
    if (debouncedSearch.length >= 2 && debouncedSearch !== value && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  }, [debouncedSearch, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (airport) => {
    setInputValue(`${airport.city} (${airport.iata_code})`);
    setIsDropdownOpen(false);
    if (onSelect) onSelect(airport);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 focus-within:border-[#2563eb] focus-within:bg-white transition-all group">
        <Search className="text-gray-400 group-focus-within:text-[#2563eb] mr-2" fontSize="small" />
        <InputBase
          fullWidth
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.length >= 2 && setIsDropdownOpen(true)}
          sx={{ 
            fontSize: '0.95rem',
            fontWeight: 500,
            '& input::placeholder': { color: '#9ca3af', opacity: 1 }
          }}
        />
        <LocalAirport className="text-gray-300 ml-2" fontSize="small" />
      </div>

      {isDropdownOpen && debouncedSearch.length >= 2 && inputValue !== value && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 1000,
            mt: 1,
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: '16px',
            border: '1px solid #f3f4f6',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
          }}
        >
          {isLoading ? (
            <Box p={3} display="flex" alignItems="center" justifyContent="center">
              <CircularProgress size={20} sx={{ color: '#2563eb', mr: 2 }} />
              <Typography variant="body2" color="text.secondary">Searching airports...</Typography>
            </Box>
          ) : suggestions.length === 0 ? (
            <Box p={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">No airports found</Typography>
            </Box>
          ) : (
            suggestions.map((airport) => (
              <MenuItem
                key={airport.id}
                onClick={() => handleSelect(airport)}
                sx={{
                  py: 1.5,
                  px: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  '&:hover': { bgcolor: 'blue.50' }
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {airport.city} <span className="text-gray-400 font-medium">— {airport.country}</span>
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {airport.airport_name}
                  </Typography>
                </Box>
                <Box bgcolor="blue.50" px={1} py={0.5} borderRadius={1} border="1px solid #dbeafe">
                  <Typography sx={{ color: '#2563eb', fontWeight: 800, fontSize: '0.75rem' }}>
                    {airport.iata_code}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Paper>
      )}
    </div>
  );
};

export default AirportAutocomplete;
