import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import TravelPostCard from '../../components/TravelCompanion/TravelPostCard';
import AirportAutocomplete from '../../components/TravelCompanion/AirportAutocomplete';
import { 
  CircularProgress, 
  Box, 
  Button,
  TextField,
  MenuItem,
  Pagination,
  Collapse,
  Avatar,
  Rating,
  IconButton
} from '@mui/material';
import { 
  Search, 
  Tune, 
  VerifiedUser, 
  Lock, 
  FamilyRestroom, 
  Payment,
  FlightTakeoff,
  PeopleAlt,
  Route,
  ThumbUp,
  Security,
  ArrowForward,
  KeyboardArrowDown,
  ChevronLeft,
  ChevronRight,
  Star
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Simple Counter animation component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function: easeOutQuart
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const BrowseListings = ({ type = 'volunteer' }) => {
  const [page, setPage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [filters, setFilters] = useState({
    direction: "india_to_usa_canada",
    fromDate: "",
    toDate: "",
    fromIata: "",
    toIata: ""
  });

  const [localFilters, setLocalFilters] = useState({ ...filters });
  const [sortBy, setSortBy] = useState('newest');

  const { data, isLoading, isError } = useQuery(
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
      direction: localFilters.direction,
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

  // Trust Badges Data
  const trustBadges = [
    { icon: <VerifiedUser fontSize="small" />, text: "Verified Community" },
    { icon: <Lock fontSize="small" />, text: "Safe In-App Messaging" },
    { icon: <Payment fontSize="small" />, text: "Free & Paid Options" },
    { icon: <FamilyRestroom fontSize="small" />, text: "Family Friendly" }
  ];

  // Stats Data
  const stats = [
    { num: 1500, suffix: "+", label: "Travelers Assisted", icon: <PeopleAlt sx={{ color: '#1565D8' }} /> },
    { num: 600, suffix: "+", label: "Active Volunteers", icon: <VerifiedUser sx={{ color: '#10B981' }} /> },
    { num: 250, suffix: "+", label: "Routes Covered", icon: <Route sx={{ color: '#F59E0B' }} /> },
    { num: 98, suffix: "%", label: "Positive Feedback", icon: <ThumbUp sx={{ color: '#6366F1' }} /> }
  ];

  // Testimonials Mock Data
  const testimonials = [
    { name: "Priya K.", text: "My parents traveled from Chennai to Dallas comfortably thanks to a volunteer who helped them through immigration and baggage claim.", rating: 5 },
    { name: "Rahul S.", text: "As a student traveling for the first time, having someone guide me during my transit in Frankfurt was a lifesaver.", rating: 5 },
    { name: "Anjali M.", text: "Felt so safe knowing my mother wasn't alone. The volunteer kept me updated when they landed. Beautiful community initiative!", rating: 5 }
  ];

  const featuredVolunteers = posts.slice(0, 3); // Mocking featured by taking first 3

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-poppins text-[#1F2937]">
      <Navbar />
      
      {/* SECTION 1: BREADCRUMB */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-6 pb-2">
        <div className="flex items-center text-sm font-medium text-[#6B7280]">
          <Link to="/" className="hover:text-[#1565D8] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/travel-companion" className="hover:text-[#1565D8] transition-colors">Travel Companion</Link>
          <span className="mx-2">›</span>
          <span className="text-[#1F2937] font-semibold">Browse {type === 'volunteer' ? 'Volunteers' : 'Requests'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 pb-20">
        
        {/* SECTION 2: PAGE HEADER */}
        <div className="text-center max-w-3xl mx-auto my-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-[#1F2937]">
            {type === 'volunteer' ? 'Browse Travel Volunteers' : 'Browse Travel Requests'}
          </h1>
          <p className="text-lg text-[#6B7280] mb-8 leading-relaxed">
            {type === 'volunteer' 
              ? 'Connect with trusted community members traveling on similar routes who can assist seniors, students, parents, and first-time flyers.'
              : 'Find travelers in our community who need a little extra help navigating airports, customs, and connecting flights.'}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-sm font-semibold text-[#4B5563]">
                <span className="text-[#1565D8] flex">{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: SEARCH EXPERIENCE */}
        <div className="bg-white rounded-[32px] p-4 md:p-6 shadow-sm border border-gray-200 mb-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            <div className="md:col-span-3">
              <AirportAutocomplete 
                placeholder="From Airport (e.g. BOM)"
                value={localFilters.fromIata ? `(${localFilters.fromIata})` : ""}
                onSelect={(airport) => setLocalFilters({ ...localFilters, fromIata: airport.iata_code })}
              />
            </div>
            
            <div className="hidden md:flex md:col-span-1 justify-center">
              <FlightTakeoff sx={{ color: '#9CA3AF' }} />
            </div>
            
            <div className="md:col-span-3">
              <AirportAutocomplete 
                placeholder="To Airport (e.g. JFK)"
                value={localFilters.toIata ? `(${localFilters.toIata})` : ""}
                onSelect={(airport) => setLocalFilters({ ...localFilters, toIata: airport.iata_code })}
              />
            </div>

            <div className="md:col-span-3">
               <TextField 
                  fullWidth
                  type="date"
                  value={localFilters.fromDate}
                  onChange={(e) => setLocalFilters({ ...localFilters, fromDate: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '16px', bgcolor: '#F8FAFC' }, '& input': { py: 1.8 } }}
                />
            </div>

            <div className="md:col-span-2">
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ 
                  bgcolor: '#1565D8', 
                  color: 'white', 
                  borderRadius: '16px', 
                  py: 1.8, 
                  fontWeight: 800, 
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#1152B3' }
                }}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 px-2">
            <Button 
              startIcon={<Tune />}
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ color: '#4B5563', textTransform: 'none', fontWeight: 600 }}
            >
              Advanced Filters {showAdvanced ? <KeyboardArrowDown sx={{ transform: 'rotate(180deg)' }}/> : <KeyboardArrowDown />}
            </Button>
            {(localFilters.fromIata || localFilters.toIata || localFilters.fromDate) && (
              <Button size="small" onClick={clearFilters} sx={{ color: '#9CA3AF', textTransform: 'none' }}>Clear</Button>
            )}
          </div>

          <Collapse in={showAdvanced}>
            <div className="pt-4 mt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <TextField
                select
                fullWidth
                label="Direction"
                size="small"
                value={localFilters.direction}
                onChange={(e) => setLocalFilters({ ...localFilters, direction: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              >
                <MenuItem value="india_to_usa_canada">India to USA/Canada</MenuItem>
                <MenuItem value="usa_canada_to_india">USA/Canada to India</MenuItem>
              </TextField>
              
              <TextField select fullWidth label="Languages" size="small" value="" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
                <MenuItem value="Telugu">Telugu</MenuItem>
                <MenuItem value="Tamil">Tamil</MenuItem>
              </TextField>

              <TextField select fullWidth label="Assistance Type" size="small" value="" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Senior">Senior Assistance</MenuItem>
                <MenuItem value="Family">Family Assistance</MenuItem>
                <MenuItem value="FirstTime">First-Time Flyer</MenuItem>
              </TextField>

              <TextField select fullWidth label="Compensation" size="small" value="" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}>
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="Free">Free Only</MenuItem>
                <MenuItem value="Paid">Paid Only</MenuItem>
              </TextField>
            </div>
          </Collapse>
        </div>

        {/* SECTION 6 & 7: SORTING */}
        {posts.length > 0 && !isLoading && (
          <div className="mb-10">

            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-[#1F2937]">All Available {type === 'volunteer' ? 'Volunteers' : 'Requests'}</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500 hidden md:block">Sort By:</span>
                <TextField
                  select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ 
                    minWidth: 150, 
                    '& .MuiOutlinedInput-root': { borderRadius: '12px', bgcolor: 'white' },
                    '& .MuiSelect-select': { py: 1, fontSize: '0.875rem', fontWeight: 600 }
                  }}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="reviews">Most Reviews</MenuItem>
                  <MenuItem value="verified">Verified First</MenuItem>
                  <MenuItem value="free">Free Volunteers</MenuItem>
                </TextField>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: VOLUNTEER LISTINGS */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <CircularProgress sx={{ color: '#1565D8' }} />
          </Box>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-bold">Error loading listings. Please try again.</div>
        ) : posts.length === 0 ? (
          /* SECTION 9: EMPTY STATE */
          <div className="bg-white p-12 md:p-24 rounded-[40px] text-center border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <FlightTakeoff sx={{ fontSize: 64, color: '#1565D8' }} />
            </div>
            <h3 className="text-3xl font-bold text-[#1F2937] mb-4">No volunteers found for this route.</h3>
            <p className="text-lg text-[#6B7280] mb-8 max-w-lg">
              We couldn't find exact matches for your search. Post your request so volunteers can find you, or get notified when someone posts this route.
            </p>
            <div className="flex gap-4">
              <Link to="/travel-companion/post-request">
                <Button 
                  variant="contained" 
                  sx={{ bgcolor: '#1565D8', color: 'white', borderRadius: 'full', px: 6, py: 1.5, fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#1152B3' } }}
                >
                  Post a Request
                </Button>
              </Link>
              <Button 
                variant="outlined" 
                sx={{ borderColor: '#E5E7EB', color: '#4B5563', borderRadius: 'full', px: 6, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}
              >
                Get Notified
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {posts.map((post) => (
                <TravelPostCard key={post.id} post={post} type={type} />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center mb-20">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={(_, v) => setPage(v)}
                shape="rounded"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': { fontWeight: 700, color: '#4B5563' },
                  '& .MuiPaginationItem-root.Mui-selected': { bgcolor: '#1565D8', color: 'white', '&:hover': { bgcolor: '#1152B3' } }
                }}
              />
            </div>
          </>
        )}

        {/* SECTION 10: TESTIMONIALS */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1F2937] mb-4">Community Success Stories</h2>
            <p className="text-[#6B7280] font-medium">Real experiences from travelers who found help through Desipath.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex text-[#F59E0B] mb-4">
                    {[...Array(test.rating)].map((_, i) => <Star key={i} fontSize="small" />)}
                  </div>
                  <p className="text-[#4B5563] italic mb-6 leading-relaxed">"{test.text}"</p>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar sx={{ bgcolor: '#F3F4F6', color: '#1565D8', fontWeight: 'bold' }}>{test.name[0]}</Avatar>
                  <span className="font-bold text-[#1F2937]">{test.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 11: CALL TO ACTION */}
        <div className="bg-[#1F2937] rounded-[32px] p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-900/20 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Want to Help Someone Travel with Confidence?
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Join our growing community of volunteers helping travelers every day. Whether it's airport navigation or just friendly company, your help matters.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/travel-companion/post-volunteer">
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ bgcolor: '#10B981', color: 'white', borderRadius: 'full', px: 6, py: 2, fontWeight: 'bold', textTransform: 'none', '&:hover': { bgcolor: '#059669' } }}
                >
                  Become a Volunteer
                </Button>
              </Link>
              <Link to="/travel-companion/browse-requests">
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 'full', px: 6, py: 2, fontWeight: 'bold', textTransform: 'none', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' } }}
                >
                  Browse Assistance Requests
                </Button>
              </Link>
            </div>
          </div>
        </div>

      </div>
      <Footer />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default BrowseListings;
