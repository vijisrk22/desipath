import React, { useState, useEffect, useRef } from 'react';
import { IoInformationCircleOutline, IoMailOutline, IoSearch, IoLocationOutline, IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Slider from 'react-slick';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';
import { getFullImageUrl } from '../../utils/imageHelper';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CATEGORIES = [
  "All", "Restaurant & Food", "Grocery & Retail", "Beauty & Wellness", 
  "Healthcare", "Education & Tutoring", "IT & Technology", 
  "Legal & Financial", "Home Services", "Travel & Immigration", 
  "Events & Entertainment", "Other"
];

const AdCard = ({ ad, onOpenInfo }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const posterUrls = ad.poster_urls || [];
  const businessName = ad.business_account?.business_name || "Business";

  const sliderSettings = {
    dots: posterUrls.length > 1,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    appendDots: dots => (
      <div style={{ bottom: "10px" }}>
        <ul className="flex justify-center gap-1"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`} />
    )
  };

  return (
    <div className="bg-white border-b border-gray-100 last:border-0 pb-6 mb-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
          {ad.business_account?.logo_url ? (
            <img src={getFullImageUrl(ad.business_account.logo_url)} alt={businessName} className="w-full h-full object-cover" />
          ) : (
            businessName.substring(0, 2).toUpperCase()
          )}
        </div>
        <div className="ml-3">
          <h3 className="text-[14px] font-semibold text-gray-900 leading-tight">{businessName}</h3>
          <p className="text-[12px] text-gray-500">{ad.category} • {ad.location_city}</p>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group">
        <Slider {...sliderSettings} className="local-ads-slider">
          {posterUrls.map((img, idx) => (
            <div key={idx} className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
              <img src={getFullImageUrl(img)} alt={`${ad.title} ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Slider>
      </div>

      {/* Footer Info */}
      <div className="px-4 mt-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h4 className="text-[14px] font-semibold text-gray-800 leading-snug">{ad.title}</h4>
          </div>
          <div className="flex items-center gap-3 shrink-0 mt-1">
            <button 
              onClick={() => window.location.href = `/messages/ad/${ad.id}/type/local_ads/user/${ad.business_account?.owner_user_id}`}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              title="Message Business"
            >
              <IoMailOutline size={24} />
            </button>
            <button 
              onClick={() => onOpenInfo(ad)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              title="View Details"
            >
              <IoInformationCircleOutline size={26} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LocationPrompt = ({ onSetLocation }) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoLocationOutline size={32} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Local Deals</h2>
          <p className="text-gray-500 mb-8">See what's happening in your city. Select your location to get started.</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => onSetLocation("Nearby")}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              Use Current Location
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-gray-200" />
              <span className="text-gray-400 text-sm font-medium">OR</span>
              <div className="h-[1px] flex-1 bg-gray-200" />
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Enter City, State"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                onKeyDown={(e) => e.key === 'Enter' && onSetLocation(e.target.value)}
              />
            </div>
            <button 
              onClick={() => onSetLocation("All")}
              className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Browse All Ads
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AdDetailsPopup = ({ ad, onClose }) => {
  if (!ad) return null;
  const businessName = ad.business_account?.business_name || "Business";

  return (
    <div className="fixed inset-0 z-[1001] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white rounded-t-[32px] sm:rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Handle for mobile */}
        <div className="h-1.5 w-12 bg-gray-300 rounded-full mx-auto mt-3 mb-1 sm:hidden" />
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 sm:top-6 sm:right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors z-10"
        >
          <IoClose size={24} />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden shrink-0 shadow-lg">
              {ad.business_account?.logo_url ? (
                <img src={getFullImageUrl(ad.business_account.logo_url)} alt={businessName} className="w-full h-full object-cover" />
              ) : (
                businessName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">{businessName}</h2>
              <p className="text-blue-600 font-medium text-sm">{ad.category} • {ad.location_city}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-[18px] font-bold text-gray-900 mb-2">{ad.title}</h3>
              <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-wrap">{ad.description}</p>
            </div>

            {ad.tags && ad.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {ad.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Business Email</span>
                <span className="text-gray-900 font-semibold">{ad.business_account?.email || "N/A"}</span>
              </div>
              {ad.website_url && (
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Website</span>
                  <a href={ad.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                    {ad.website_url.replace('https://', '').replace('http://', '')}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <button 
                onClick={() => window.location.href = `/messages/ad/${ad.id}/type/local_ads/user/${ad.business_account?.owner_user_id}`}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                <IoMailOutline size={22} />
                Message Business
              </button>
              {ad.website_url && (
                <a 
                  href={ad.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-all border border-gray-200 flex items-center justify-center"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function Localdeals() {
  const [ads, setAds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [location, setLocation] = useState(localStorage.getItem('local_deals_location'));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef();
  const lastAdElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    setAds([]);
    setPage(1);
    setHasMore(true);
    fetchAds(1, true);
  }, [selectedCategory, location]);

  useEffect(() => {
    if (page > 1) {
      fetchAds(page);
    }
  }, [page]);

  const fetchAds = async (pageNum, isNew = false) => {
    setLoading(true);
    try {
      const cityOnly = location ? location.split(',')[0].trim() : "";
      const categoryParam = selectedCategory === "All" ? "" : selectedCategory;
      const res = await api.get(`/api/local-ads/feed?page=${pageNum}&category=${categoryParam}&city=${cityOnly}&search=${searchQuery}`);
      
      const newAds = res.data.data;
      if (isNew) {
        setAds(newAds);
      } else {
        setAds(prev => [...prev, ...newAds]);
      }
      
      setHasMore(res.data.current_page < res.data.last_page);
    } catch (err) {
      console.error('Error fetching ads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setAds([]);
      setPage(1);
      fetchAds(1, true);
    }
  };

  const handleSetLocation = (newLoc) => {
    localStorage.setItem('local_deals_location', newLoc);
    setLocation(newLoc);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Location Prompt for Guests */}
      {!location && <LocationPrompt onSetLocation={handleSetLocation} />}

      {/* Module Header (Sticky below Navbar) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-[600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Local Deals</h1>
            {location && (
              <button 
                onClick={() => setLocation(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <IoLocationOutline size={14} />
                {location}
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Search deals, businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <main className="max-w-[600px] mx-auto pb-20">
        <div className="mt-2">
          {ads.length > 0 ? (
            ads.map((ad, index) => (
              <div 
                key={ad.id} 
                ref={index === ads.length - 1 ? lastAdElementRef : null}
              >
                <AdCard ad={ad} onOpenInfo={setSelectedAd} />
              </div>
            ))
          ) : !loading && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏜️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No deals found here yet</h3>
              <p className="text-gray-400 max-w-xs mx-auto">Try changing your location or category to find amazing local offers.</p>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && (
          <div className="text-center py-12 text-gray-400 text-sm font-medium">
            No more deals in your area. Check back later!
          </div>
        )}
      </main>

      <Footer newsletter={"block"} />

      {/* Ad Details Modal */}
      <AnimatePresence>
        {selectedAd && (
          <AdDetailsPopup 
            ad={selectedAd} 
            onClose={() => setSelectedAd(null)} 
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .local-ads-slider .slick-prev, .local-ads-slider .slick-next {
          z-index: 10;
          width: 30px;
          height: 30px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .local-ads-slider:hover .slick-prev, .local-ads-slider:hover .slick-next {
          opacity: 1;
        }
        .local-ads-slider .slick-prev { left: 10px; }
        .local-ads-slider .slick-next { right: 10px; }
        .local-ads-slider .slick-prev:before, .local-ads-slider .slick-next:before {
          font-size: 24px;
          text-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .local-ads-slider .slick-dots li button:before { display: none; }
      `}} />
    </div>
  );
}
