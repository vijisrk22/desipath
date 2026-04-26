import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import TravelPostCard from '../../components/TravelCompanion/TravelPostCard';
import { 
  CircularProgress, 
  Box, 
  Typography, 
  Button,
  TextField,
  MenuItem,
  Pagination
} from '@mui/material';
import { Search, FilterList, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';

import AirportAutocomplete from '../../components/TravelCompanion/AirportAutocomplete';

const BrowseListings = ({ type = 'volunteer' }) => {
  const [page, setPage] = useState(1);
  
  // These are the actual filters being sent to the API
  const [filters, setFilters] = useState({
    direction: "india_to_usa_canada",
    fromDate: "",
    toDate: "",
    fromIata: "",
    toIata: ""
  });

  // Local state for the UI before user clicks "Search"
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const { data, isLoading, isError, refetch } = useQuery(
    ['travelPosts', type, page, filters],
    async () => {
      const endpoint = type === 'volunteer' ? '/api/travel-companion/volunteers' : '/api/travel-companion/requests';
      const params = new URLSearchParams({
        page,
        direction: filters.direction,
        from_date: filters.fromDate,
        to_date: filters.toDate,
        from_iata: filters.fromIata,
        to_iata: filters.toIata
      });
      const res = await api.get(`${endpoint}?${params.toString()}`);
      return res.data;
    },
    { keepPreviousData: true }
  );

  const handleSearch = () => {
    setFilters({ ...localFilters });
    setPage(1);
  };

  const clearFilters = () => {
    const cleared = {
      direction: localFilters.direction, // Keep direction
      fromDate: "",
      toDate: "",
      fromIata: "",
      toIata: ""
    };
    setLocalFilters(cleared);
    setFilters(cleared);
    setPage(1);
  };

  const posts = data?.data || [];
  const totalPages = data?.last_page || 1;

  if (isError) return <div className="text-center py-20 text-red-500 font-bold">Error loading listings. Please try again.</div>;

  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-6 pb-20 px-4">
      <div className="max-w-6xl mx-auto mb-6">
        <Link to="/" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Home</Link>
        <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
        <Link to="/travel-companion" className="text-gray-500 hover:text-[#2563eb] text-sm font-medium font-dmsans">Travel Companion</Link>
        <span className="text-gray-400 mx-2 text-sm font-medium font-dmsans">{">"}</span>
        <span className="text-gray-900 text-sm font-bold font-dmsans">
          Browse {type === 'volunteer' ? 'Volunteers' : 'Requests'}
        </span>
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Browse {type === 'volunteer' ? 'Travel Volunteers' : 'Travel Requests'}
            </h1>
            <p className="text-gray-500 font-medium">
              Find someone on the same flight journey to connect and help.
            </p>
          </div>
          <Link to={type === 'volunteer' ? "/travel-companion/post-volunteer" : "/travel-companion/post-request"}>
            <Button 
              variant="contained" 
              startIcon={<Add sx={{ color: 'white' }} />}
              sx={{ 
                bgcolor: '#2563eb', 
                color: 'white !important', 
                '&:hover': { bgcolor: '#1d4ed8' }, 
                borderRadius: '16px', 
                px: 4, 
                py: 1.5, 
                fontWeight: 800, 
                textTransform: 'none',
                '& .MuiButton-startIcon': { color: 'white' }
              }}
            >
              Post {type === 'volunteer' ? 'Volunteering' : 'Request'}
            </Button>
          </Link>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-gray-100 mb-10 overflow-visible">
          <div className="grid grid-cols-12 gap-6 items-end">
            {/* 1. Travel Direction (Reduced length) */}
            <Box className="col-span-12 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-2 ml-1">Direction *</label>
              <TextField
                select
                fullWidth
                size="small"
                value={localFilters.direction}
                onChange={(e) => setLocalFilters({ ...localFilters, direction: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '16px', 
                    bgcolor: 'blue.50/30',
                    '& fieldset': { borderColor: '#dbeafe' },
                    '&:hover fieldset': { borderColor: '#2563eb' }
                  },
                  '& .MuiSelect-select': { py: 1.5, fontSize: '0.9rem', fontWeight: 700 }
                }}
              >
                <MenuItem value="india_to_usa_canada">IN → US/CA</MenuItem>
                <MenuItem value="usa_canada_to_india">US/CA → IN</MenuItem>
              </TextField>
            </Box>

            {/* 2. Date Range */}
            <Box className="col-span-12 md:col-span-3">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Travel Dates</label>
              <div className="grid grid-cols-2 gap-2">
                <TextField 
                  fullWidth
                  type="date"
                  size="small"
                  value={localFilters.fromDate}
                  onChange={(e) => setLocalFilters({ ...localFilters, fromDate: e.target.value })}
                  InputProps={{ sx: { borderRadius: '16px', bgcolor: 'gray.50/30', '& fieldset': { borderColor: '#f3f4f6' } } }}
                  sx={{ '& input': { py: 1.5, fontSize: '0.85rem' } }}
                />
                <TextField 
                  fullWidth
                  type="date"
                  size="small"
                  value={localFilters.toDate}
                  onChange={(e) => setLocalFilters({ ...localFilters, toDate: e.target.value })}
                  InputProps={{ sx: { borderRadius: '16px', bgcolor: 'gray.50/30', '& fieldset': { borderColor: '#f3f4f6' } } }}
                  sx={{ '& input': { py: 1.5, fontSize: '0.85rem' } }}
                />
              </div>
            </Box>

            {/* 3. Airport Autocomplete */}
            <Box className="col-span-12 md:col-span-5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Route (From & To Airport)</label>
              <div className="grid grid-cols-2 gap-3 items-center">
                <AirportAutocomplete 
                  placeholder="From (e.g. BOM)"
                  value={localFilters.fromIata ? `Any (${localFilters.fromIata})` : ""}
                  onSelect={(airport) => setLocalFilters({ ...localFilters, fromIata: airport.iata_code })}
                />
                <AirportAutocomplete 
                  placeholder="To (e.g. JFK)"
                  value={localFilters.toIata ? `Any (${localFilters.toIata})` : ""}
                  onSelect={(airport) => setLocalFilters({ ...localFilters, toIata: airport.iata_code })}
                />
              </div>
            </Box>

            {/* Search Button */}
            <Box className="col-span-12 md:col-span-2">
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<Search sx={{ color: 'white' }} />}
                sx={{ 
                  bgcolor: '#f97316', 
                  color: 'white !important', 
                  '&:hover': { bgcolor: '#ea580c' }, 
                  borderRadius: '16px', 
                  py: 1.6, 
                  fontWeight: 900, 
                  textTransform: 'none',
                  boxShadow: '0 8px 20px -6px rgba(249,115,22,0.4)',
                  '& .MuiButton-startIcon': { color: 'white' }
                }}
              >
                Search
              </Button>
            </Box>
          </div>

          <div className="flex justify-start mt-4">
             <Button 
               size="small"
               onClick={clearFilters}
               sx={{ color: 'gray', textTransform: 'none', fontWeight: 700, opacity: 0.6, '&:hover': { opacity: 1 } }}
             >
               Reset Optional Filters
             </Button>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: '#2563eb' }} />
          </Box>
        ) : posts.length === 0 ? (
          <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
            <div className="text-6xl mb-6">✈️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No {type === 'volunteer' ? 'volunteers' : 'requests'} found</h3>
            <p className="text-gray-500 font-medium mb-8">Try adjusting your filters or be the first to post!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <TravelPostCard key={post.id} post={post} type={type} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, v) => setPage(v)}
                sx={{
                  '& .MuiPaginationItem-root.Mui-selected': { bgcolor: '#2563eb', color: 'white', fontWeight: 800 },
                  '& .MuiPaginationItem-root:hover': { bgcolor: 'blue.50' }
                }}
              />
            </div>
          </>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default BrowseListings;
