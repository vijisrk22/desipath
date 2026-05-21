import { useState, useEffect } from "react";
import ServiceTopBar from "../../components/ServiceTopBar";
import api from "../../utils/api";
import AstrologyCard from "./AstrologyCard";
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Button
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const COUNTRIES = ["USA", "India", "UAE", "Singapore", "Australia"];
const SERVICES = [
  "Vedic Astrology", "Horoscope", "Birth Chart", "Nadi Astrology", 
  "Numerology", "Tarot Card Reading", "Palm Reading", "Vastu for Home",
  "Gemstone Recommendation", "Face Reading"
];

export default function FindAstrology() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    country: "",
    service_type: "",
    search: ""
  });

  useEffect(() => {
    fetchAds();
  }, [filters]);

  const fetchAds = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.service_type) params.append('service_type', filters.service_type);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);

    api.get(`/api/astrologyads?${params.toString()}`)
      .then(res => {
         const data = res.data;
         if (Array.isArray(data)) setAds(data);
         else if (data && Array.isArray(data.data)) setAds(data.data);
         setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const paths = [
    { text: "Home", eP: "/" },
    { text: "Astrology", eP: "/astrologer/find" },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
      <ServiceTopBar 
        inputs={[]} 
        title="Discover Top Astrologers" 
        paths={paths} 
      />

      <div className="max-w-[1440px] mx-auto px-[7%] mt-[-45px] relative z-20">
        {/* Unified Search Section */}
        <div className="bg-white p-2 md:p-3 rounded-[32px] md:rounded-full shadow-2xl border border-slate-200 backdrop-blur-xl flex flex-col md:flex-row gap-2 items-center">
          
          {/* Keyword Search */}
          <div className="w-full md:flex-[1.5] relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4f46e5]">
              <SearchIcon sx={{ fontSize: 20 }} />
            </div>
            <input 
              type="text"
              placeholder="Search name, expertise or keyword..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-full focus:ring-2 focus:ring-[#4f46e5]/10 transition-all text-sm font-normal"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1, borderColor: '#e2e8f0' }} />

          {/* Country Selection */}
          <div className="w-full md:flex-1">
            <FormControl fullWidth size="small">
              <Select
                value={filters.country}
                displayEmpty
                onChange={(e) => handleFilterChange('country', e.target.value)}
                sx={{ 
                  borderRadius: '100px', 
                  bgcolor: 'transparent',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                <MenuItem value="">Any Location</MenuItem>
                {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 1, borderColor: '#e2e8f0' }} />

          {/* Service Specialization */}
          <div className="w-full md:flex-1">
            <FormControl fullWidth size="small">
              <Select
                value={filters.service_type}
                displayEmpty
                onChange={(e) => handleFilterChange('service_type', e.target.value)}
                sx={{ 
                  borderRadius: '100px', 
                  bgcolor: 'transparent',
                  border: 'none',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                <MenuItem value="">All Specializations</MenuItem>
                {SERVICES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </div>

          {/* Action Button */}
          <div className="w-full md:w-auto md:ml-2">
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ 
                borderRadius: '100px', 
                px: 5, 
                py: 1.5, 
                bgcolor: '#4f46e5', 
                fontWeight: 500,
                textTransform: 'none',
                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-1px)' },
                transition: 'all 0.3s',
                fontFamily: "'Outfit', sans-serif"
              }}
              onClick={fetchAds}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Status & Sorting Indicator */}
        <div className="mt-6 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
             <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
               {ads.length} experts available online
             </Typography>
           </div>

           <div className="flex items-center gap-3">
             <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.65rem' }}>Sort By:</Typography>
             <FormControl size="small" sx={{ minWidth: 180 }}>
               <Select
                 value={filters.sort || "newest"}
                 onChange={(e) => handleFilterChange('sort', e.target.value)}
                 sx={{ 
                   borderRadius: '12px', 
                   fontSize: '0.8rem',
                   fontWeight: 500,
                   bgcolor: 'white',
                   fontFamily: "'Outfit', sans-serif",
                   '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
                   '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#4f46e5' },
                   '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#4f46e5' }
                 }}
               >
                 <MenuItem value="newest">Newest First</MenuItem>
                 <MenuItem value="price_asc">Price: Low to High</MenuItem>
                 <MenuItem value="price_desc">Price: High to Low</MenuItem>
                 <MenuItem value="exp_desc">Experience: High to Low</MenuItem>
                 <MenuItem value="name_asc">Name: A-Z</MenuItem>
               </Select>
             </FormControl>
           </div>
        </div>

        {/* Results Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <CircularProgress sx={{ color: '#4f46e5' }} />
            </div>
          ) : (
            <>
              {ads.length > 0 ? (
                <Grid container spacing={4}>
                  {ads.map(ad => (
                    <Grid item xs={12} sm={6} lg={4} key={ad.id}>
                      <AstrologyCard ad={ad} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                  <div className="text-5xl mb-4">🔮</div>
                  <Typography variant="h6" fontWeight={500} color="#0f172a" sx={{ fontFamily: "'Outfit', sans-serif" }}>
                    No astrologers found matching your criteria.
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    Try adjusting your filters or searching for another location.
                  </Typography>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
