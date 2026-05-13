import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServiceTopBar from "../../components/ServiceTopBar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
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
  Button,
  Slider,
  Paper
} from '@mui/material';
import { Search as SearchIcon, Home as HomeIcon, CurrencyExchange, LocationOn } from '@mui/icons-material';
import PropertyCard from "./PropertyCard";

const COUNTRIES = ["India", "Dubai"];
const PROPERTY_TYPES = ["Apartment", "Villa", "Individual House"];
const CURRENCIES = [
  { code: "INR", symbol: "₹", factor: 1 },
  { code: "AED", symbol: "د.إ", factor: 0.044 }, // Approximate relative to INR for scale
  { code: "USD", symbol: "$", factor: 0.012 }
];

export default function FindProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [priceRange, setPriceRange] = useState([0, 100000000]); // Default 0 to 10Cr INR
  const [exchangeRates, setExchangeRates] = useState({});
  
  const [filters, setFilters] = useState({
    country: "India",
    property_type: "",
    search: "",
    sort: "newest"
  });

  const fetchProperties = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.country) params.append('country', filters.country);
    if (filters.property_type) params.append('property_type', filters.property_type);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    
    // Scale prices back to INR for backend if needed, or send current range
    params.append('min_price', priceRange[0]);
    params.append('max_price', priceRange[1]);

    api.get(`/api/realestate?${params.toString()}`)
      .then(res => {
        setProperties(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Fetch live-cached exchange rates
    api.get('/api/realestate/exchange-rates')
      .then(res => {
        const ratesMap = {};
        res.data.forEach(curr => {
          ratesMap[curr.code] = parseFloat(curr.rate_to_usd);
        });
        setExchangeRates(ratesMap);
      })
      .catch(err => console.error("Error fetching rates:", err));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [filters.sort]);

  const formatPrice = (amount, code) => {
    if (code === 'INR') {
      if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
      if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} Lakhs`;
      return `₹ ${amount.toLocaleString('en-IN')}`;
    }
    if (code === 'AED') return `AED ${amount.toLocaleString('en-US')}`;
    if (code === 'USD') return `$ ${amount.toLocaleString('en-US')}`;
    return `${code} ${amount.toLocaleString()}`;
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (code) => {
    const newCurrency = CURRENCIES.find(c => c.code === code);
    setCurrency(newCurrency);
  };

  const paths = [
    { text: "Home", eP: "/" },
    { text: "Real Estate", eP: "/real-estate/find" },
  ];

  return (
    <main>
      <Navbar />
      <div className="bg-[#f8fafc] min-h-screen pb-20" style={{ fontFamily: "'Inter', sans-serif" }}>
        <ServiceTopBar 
          inputs={[]} 
          title="Find Your Dream Property" 
          paths={paths} 
        >
          <Button 
            component={Link} 
            to="/real-estate/post" 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', 
              color: '#1d4ed8', 
              fontWeight: 800, 
              borderRadius: '100px', 
              px: 4,
              '&:hover': { bgcolor: '#f8fafc' },
              textTransform: 'none',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            Post Your Property 🏡
          </Button>
        </ServiceTopBar>

        <div className="max-w-[1440px] mx-auto px-[7%] mt-[-45px] relative z-20">
          {/* Unified Search Section */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: '32px', shadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', bgcolor: 'white' }}>
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              
              {/* Search Input */}
              <div className="w-full lg:flex-[1.5] relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1d4ed8]">
                  <SearchIcon sx={{ fontSize: 20 }} />
                </div>
                <input 
                  type="text"
                  placeholder="Search city, area or project name..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border-none rounded-full focus:ring-2 focus:ring-[#1d4ed8]/10 transition-all text-sm font-normal"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' }, mx: 1, borderColor: '#e2e8f0' }} />

              {/* Filters Row */}
              <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:flex-[2]">
                {/* Country */}
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    sx={{ 
                      borderRadius: '100px', 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      fontFamily: "'Outfit', sans-serif",
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                    startAdornment={<LocationOn sx={{ color: '#64748b', fontSize: 18, mr: 1 }} />}
                  >
                    {COUNTRIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>

                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mx: 0.5, borderColor: '#e2e8f0' }} />

                {/* Property Type */}
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.property_type}
                    displayEmpty
                    onChange={(e) => handleFilterChange('property_type', e.target.value)}
                    sx={{ 
                      borderRadius: '100px', 
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      fontFamily: "'Outfit', sans-serif",
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                    startAdornment={<HomeIcon sx={{ color: '#64748b', fontSize: 18, mr: 1 }} />}
                  >
                    <MenuItem value="">All Property Types</MenuItem>
                    {PROPERTY_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </Select>
                </FormControl>
              </div>

              <Button 
                variant="contained" 
                onClick={fetchProperties}
                sx={{ 
                  borderRadius: '100px', 
                  px: 6, 
                  py: 1.5, 
                  bgcolor: '#1d4ed8', 
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(29, 78, 216, 0.3)',
                  '&:hover': { bgcolor: '#1e40af' },
                  fontFamily: "'Outfit', sans-serif",
                  minWidth: '140px'
                }}
              >
                Search
              </Button>
            </div>

            <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

            {/* Advanced Filters: Price Range & Currency */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 pb-2">
              <div className="flex items-center gap-6 w-full md:w-2/3">
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', minWidth: '80px' }}>
                  Price Range:
                </Typography>
                <Box sx={{ flex: 1, px: 2 }}>
                  <Slider
                    value={priceRange}
                    onChange={(e, newVal) => setPriceRange(newVal)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={filters.country === "India" ? 100000000 : 5000000}
                    sx={{ color: '#1d4ed8' }}
                    valueLabelFormat={(v) => formatPrice(v, currency.code)}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#1e293b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {formatPrice(priceRange[0], currency.code)} - {formatPrice(priceRange[1], currency.code)}
                </Typography>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {CURRENCIES.map(curr => (
                  <button
                    key={curr.code}
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currency.code === curr.code ? 'bg-white text-[#1d4ed8] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {curr.code}
                  </button>
                ))}
              </div>
            </div>
          </Paper>

          {/* Results Header */}
          <div className="mt-8 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></div>
               <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                 {properties.length || 0} premium properties found
               </Typography>
             </div>

             <div className="flex items-center gap-3">
               <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase', fontSize: '0.65rem' }}>Sort By:</Typography>
               <FormControl size="small" sx={{ minWidth: 160 }}>
                 <Select
                   value={filters.sort}
                   onChange={(e) => handleFilterChange('sort', e.target.value)}
                   sx={{ 
                     borderRadius: '12px', 
                     fontSize: '0.8rem',
                     fontWeight: 500,
                     bgcolor: 'white',
                     fontFamily: "'Outfit', sans-serif",
                     '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
                   }}
                 >
                   <MenuItem value="newest">Newest First</MenuItem>
                   <MenuItem value="price_asc">Price: Low to High</MenuItem>
                   <MenuItem value="price_desc">Price: High to Low</MenuItem>
                   <MenuItem value="size_desc">Area: High to Low</MenuItem>
                 </Select>
               </FormControl>
             </div>
          </div>

          {/* Results Grid */}
          <div className="mt-10 mb-20">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <CircularProgress sx={{ color: '#1d4ed8', mb: 2 }} />
                <Typography variant="body2" color="#64748b">Finding your perfect match...</Typography>
              </div>
            ) : properties.length > 0 ? (
              <Grid container spacing={4}>
                {properties.map(property => (
                  <Grid item xs={12} sm={6} lg={4} key={property.id}>
                    <PropertyCard 
                      property={property} 
                      currency={currency} 
                      exchangeRates={exchangeRates} 
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-slate-200">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <HomeIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                 </div>
                 <Typography variant="h5" fontWeight={500} color="#0f172a" mb={1} sx={{ fontFamily: "'Outfit', sans-serif" }}>
                   No Properties Found
                 </Typography>
                 <Typography variant="body2" color="#64748b" maxWidth="400px" mx="auto">
                   We couldn't find any properties matching your criteria. Try adjusting your filters or search terms.
                 </Typography>
                 <Button 
                   variant="outlined" 
                   onClick={() => {
                     setFilters({ country: "India", property_type: "", search: "", sort: "newest" });
                     setPriceRange([0, 100000000]);
                   }}
                   sx={{ 
                     mt: 4, 
                     borderRadius: '100px', 
                     px: 4, 
                     textTransform: 'none', 
                     borderColor: '#e2e8f0', 
                     color: '#475569',
                     fontWeight: 500
                   }}
                 >
                   Reset All Filters
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer newsletter="block" />
    </main>
  );
}
