import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../utils/api';
import { useForm } from 'react-hook-form';
import { BUY_SELL_CATEGORIES } from '../../constants/buySellItemCategories';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationSelectorModal from '../../components/LocationSelectorModal';
import { 
  LocationOn, Search, Add, FilterList, ChatBubbleOutline, 
  Share, FavoriteBorder, Verified, Star, KeyboardArrowDown, 
  LocalOffer, TrendingUp, People, Storefront
} from '@mui/icons-material';

// --- Subcomponents ---

// 1. Marketplace Stats
const MarketplaceStats = () => (
  <div className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0857d0]">
            <Storefront />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">241</div>
            <div className="text-sm font-medium text-gray-500">Active Listings</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <TrendingUp />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">58</div>
            <div className="text-sm font-medium text-gray-500">New Today</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <People />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">120</div>
            <div className="text-sm font-medium text-gray-500">Verified Sellers</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
            <LocalOffer />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm font-medium text-gray-500">Categories</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Skeleton Loader
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-8 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      <div className="h-5 bg-gray-200 rounded-md w-3/4 animate-pulse" />
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-md w-1/4 animate-pulse" />
      </div>
      <div className="pt-4 mt-2 border-t border-gray-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse" />
      </div>
    </div>
  </div>
);

// Main Component
const BuySellItemsSearch = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    min_price: '',
    max_price: '',
    radius: 50
  });
  const { setValue, watch } = useForm();
  const locationValue = watch('location');
  const [loading, setLoading] = useState(true);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Newest First');

  const fetchItems = async () => {
    setLoading(true);
    try {
      let city = '';
      let zipcode = '';
      if (locationValue) {
        const parts = locationValue.split(',').map(p => p.trim());
        if (parts.length >= 3) {
           city = parts[0];
           zipcode = parts[parts.length - 1];
        } else {
           const lastPart = parts[parts.length - 1];
           if (/\d/.test(lastPart)) zipcode = lastPart;
           else city = parts[0];
        }
      }
      const response = await api.get(`/api/buy-sell-items`, { params: { ...filters, city, zipcode } });
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [locationValue]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setFilters({ category: 'All Categories', min_price: '', max_price: '', radius: 50 });
    setValue('location', '');
  };

  const MOCK_SELLERS = [
    { name: 'John D.', verified: true, rating: 4.8, avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Sarah M.', verified: true, rating: 4.9, avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Mike R.', verified: false, rating: 4.5, avatar: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Emily W.', verified: true, rating: 5.0, avatar: 'https://i.pravatar.cc/150?u=4' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-[#0857d0] overflow-hidden">
        {/* Subtle background gradient overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-3/5 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Buy & Sell Items</h1>
              <p className="text-lg md:text-xl text-blue-100 mb-8 font-light">Discover great local deals from trusted sellers near you.</p>
              
              {/* Modern Search Toolbar */}
              <div className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-2xl p-2 gap-2 max-w-2xl mx-auto md:mx-0">
                <button 
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex-1 flex items-center px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <LocationOn className="text-[#0857d0] mr-3" />
                  <span className={`truncate font-medium ${!locationValue ? 'text-gray-400' : 'text-gray-800'}`}>
                    {locationValue || "City, State or ZIP"}
                  </span>
                </button>
                <div className="hidden sm:block w-px bg-gray-200 my-2"></div>
                <button 
                  onClick={handleSearch}
                  className="bg-[#0857d0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Search fontSize="small" />
                  Search
                </button>
              </div>
            </div>

            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <Link 
                to="/buy-sell-items/post" 
                className="bg-white text-[#0857d0] px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3 text-lg"
              >
                <Add />
                Post an Item
              </Link>
            </div>
          </div>
        </div>
      </div>

      <MarketplaceStats />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 relative">
        
        {/* Filter Sidebar (Desktop) / Drawer (Mobile) */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 md:relative md:z-0 md:w-1/4 md:translate-x-0 md:bg-transparent md:shadow-none ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="md:sticky md:top-24 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-full md:h-auto overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button className="md:hidden text-gray-400 hover:text-gray-600" onClick={() => setIsMobileFilterOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-[#0857d0] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option>All Categories</option>
                    {BUY_SELL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <KeyboardArrowDown />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-8 pr-3 rounded-xl focus:outline-none focus:bg-white focus:border-[#0857d0] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      value={filters.min_price}
                      onChange={(e) => setFilters({...filters, min_price: e.target.value})}
                    />
                  </div>
                  <span className="text-gray-400 font-medium">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 pl-8 pr-3 rounded-xl focus:outline-none focus:bg-white focus:border-[#0857d0] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                      value={filters.max_price}
                      onChange={(e) => setFilters({...filters, max_price: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Search Radius</label>
                  <span className="text-sm font-bold text-[#0857d0]">{filters.radius} miles</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="200" 
                  value={filters.radius} 
                  onChange={(e) => setFilters({...filters, radius: e.target.value})}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0857d0]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1 font-medium">
                  <span>1 mi</span>
                  <span>200 mi</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button type="submit" className="w-full bg-[#0857d0] text-white font-bold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md">
                  Apply Filters
                </button>
                <button type="button" onClick={handleReset} className="w-full bg-white text-gray-600 font-bold px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMobileFilterOpen(false)}></div>
        )}

        {/* Main Content Area */}
        <div className="w-full md:w-3/4">
          
          {/* Listing Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Items for Sale</h2>
              <p className="text-gray-500 font-medium mt-1">{loading ? 'Searching...' : `${items.length} Results Found`}</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                className="md:hidden flex-1 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <FilterList fontSize="small" /> Filters
              </button>
              <div className="relative flex-1 sm:flex-none">
                <select 
                  className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#0857d0] font-medium"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Popular</option>
                  <option>Nearest</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <KeyboardArrowDown fontSize="small" />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-32 h-32 mb-6 text-gray-200">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9h-2V7h-2v5H6v2h2v5h2v-5h2v-2z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                We couldn't find any items matching your current search criteria. Try adjusting your filters or expanding your search area.
              </p>
              <button 
                onClick={handleReset} 
                className="bg-[#0857d0] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, idx) => {
                // Mock seller data for UI presentation
                const sellerName = item.user?.name || 'Unknown Seller';
                const seller = {
                  name: sellerName,
                  avatar: item.user?.profile_photo 
                    ? (item.user.profile_photo.startsWith('http') ? item.user.profile_photo : `${BASE_URL}${item.user.profile_photo}`) 
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=random`,
                  verified: true,
                  rating: '5.0'
                };
                const isNew = idx % 5 === 0;
                const isFeatured = idx % 7 === 0 && !isNew;

                return (
                  <Link 
                    to={`/buy-sell-items/details/${item.id}`} 
                    key={item.id} 
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      {item.pictures && item.pictures.length > 0 ? (
                        <img 
                          src={item.pictures[0].startsWith('http') ? item.pictures[0] : `${BASE_URL}${item.pictures[0]}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={item.title} 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Storefront sx={{ fontSize: 64 }} />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isNew && <span className="bg-[#0857d0] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">New</span>}
                        {isFeatured && <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">Featured</span>}
                      </div>

                      {/* Favorite Button */}
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm z-10" onClick={(e) => { e.preventDefault(); /* Handle save */ }}>
                        <FavoriteBorder fontSize="small" />
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="text-2xl font-black text-gray-900 mb-1">
                        ${Number(item.price).toLocaleString()}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg leading-tight mb-2 line-clamp-2">{item.title}</h3>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-md">{item.category}</span>
                      </div>

                      <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-1 mt-auto">
                        <LocationOn fontSize="inherit" className="text-gray-400" />
                        <span className="truncate">{item.city}{item.city && item.state ? ', ' : ''}{item.state}</span>
                      </div>
                      <div className="text-xs text-gray-400 ml-5">
                        Posted 2 days ago
                      </div>
                    </div>

                    {/* Seller Preview & Actions */}
                    <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={seller.avatar} alt={seller.name} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <div className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            {seller.name}
                            {seller.verified && <Verified className="text-blue-500 text-[14px]" />}
                          </div>
                          <div className="flex items-center gap-0.5">
                            <Star className="text-yellow-400 text-[12px]" />
                            <span className="text-xs font-semibold text-gray-700">{seller.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Link 
          to="/buy-sell-items/post" 
          className="w-14 h-14 bg-[#0857d0] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(8,87,208,0.4)] hover:bg-blue-700 transition-transform active:scale-95"
        >
          <Add fontSize="large" />
        </Link>
      </div>
      
      <LocationSelectorModal 
        open={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
        onSelectLocation={(loc) => {
          setValue('location', loc);
          setIsLocationModalOpen(false);
        }} 
      />
      
      <Footer newsletter={"block"} />
    </div>
  );
};

export default BuySellItemsSearch;
