import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LocationSelectorModal from "../../components/LocationSelectorModal";
import KidsClassCard from "../../components/KidsClass/KidsClassCard";
import api from "../../utils/api";
import { useForm } from "react-hook-form";
import LocationAutocompleteInput from "../../components/InputTemplate/LocationAutocompleteInput";

export default function KidsClassLanding() {
  const { control, setValue, watch } = useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimeout = React.useRef(null);
  const abortController = React.useRef(null);

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setCurrentLocation(savedLocation);
    }
    
    const fetchCats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/marketplace/categories?module=kids_class');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch Kids categories", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchKeywords = async () => {
      try {
        const res = await api.get('/api/kids-classes/keywords');
        if (res.data.success) {
          setKeywords(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch keywords", err);
      }
    };

    fetchCats();
    fetchKeywords();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setValue("location", currentLocation);
    }
  }, [currentLocation, setValue]);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setCurrentLocation(locationString);
    setShowLocationModal(false);
  };

  const performSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    // Cancel previous request if any
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setSearching(true);
    try {
      const res = await api.get(`/api/kids-classes/search?q=${encodeURIComponent(term)}`, {
        signal: abortController.current.signal
      });
      if (res.data.success) {
        setSearchResults(res.data.data);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        // Ignored
      } else {
        console.error("Search failed", err);
      }
    } finally {
      // Only stop searching if this was the latest request
      if (!abortController.current || abortController.current.signal.aborted) return;
      setSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim().length > 0) {
      const filtered = keywords.filter(k => 
        k.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
      
      searchTimeout.current = setTimeout(() => {
        performSearch(value);
      }, 400); // 400ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSearchResults([]);
      setSearching(false);
      if (abortController.current) abortController.current.abort();
    }
  };

  const handleSuggestionClick = (keyword) => {
    setSearchTerm(keyword);
    setShowSuggestions(false);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    performSearch(keyword);
  };

  const filteredCategories = categories.map((category) => {
    if (category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return category;
    }
    const filteredSubs = (category.subcategories || []).filter((sub) =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...category, subcategories: filteredSubs };
  }).filter((category) => (category.subcategories || []).length > 0);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />

      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-r from-blue-100 via-[#e0f2fe] to-pink-100 py-10 px-[7%] relative z-20">
        <div className="absolute top-4 right-[7%] z-20 hidden md:block">
          <Link 
            to="/kids-class/instructor-portal"
            className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] text-gray-800 text-sm font-bold rounded-[57px] shadow-md transition-all flex items-center gap-2"
          >
            <span>📢</span>
            Post Ad
          </Link>
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#007185] font-dmsans mb-4">
            Explore Classes for Kids 🎨📚
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-medium mb-6 max-w-2xl">
            Discover a world of rich cultural learning, academics, and arts. Find the perfect classes to nurture your child's roots and talents!
          </p>

          <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-3 justify-center bg-white rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl relative z-20">
            <div className="w-full md:w-1/2 relative md:border-r border-gray-200">
              <input
                type="text"
                placeholder="Search for languages, math, music..."
                value={searchTerm}
                onChange={handleSearchChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full py-2 pl-12 pr-6 rounded-full border-none focus:outline-none focus:ring-0 text-base font-dmsans transition-colors"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </span>

              {/* Autocomplete Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] animate-fade-in-up">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full px-6 py-3 text-left hover:bg-blue-50 flex items-center gap-3 group transition-colors"
                    >
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">🔍</span>
                      <span className="text-gray-700 font-medium">{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 px-2">
              <LocationAutocompleteInput
                control={control}
                setValue={setValue}
                watch={watch}
                type="search"
                placeholder="City, State, ZIP"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
           <span className="text-9xl">🎒</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow w-full px-[7%] py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Search Results Section (Shown only if searching) */}
            {searchTerm && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span className="text-blue-500">🔍</span>
                    Results for "{searchTerm}"
                  </h2>
                  <span className="text-gray-500 font-medium">{searchResults.length} classes found</span>
                </div>

                {searching ? (
                  <div className="flex flex-col items-center py-12 space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Searching for classes...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((item) => (
                      <KidsClassCard key={item.id} cls={item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg">No specific classes match your search term exactly.</p>
                  </div>
                )}
              </div>
            )}

            {/* Categories Section (Filtered locally) */}
            {(!searchTerm || filteredCategories.length > 0) && (
              <div className="space-y-8">
                {filteredCategories.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Explore by Category</h2>
                  </div>
                )}
                
                {filteredCategories.map((category, idx) => (
                  <div key={idx} className={`p-5 md:p-6 rounded-2xl ${category.color || 'bg-white'} shadow-sm border`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`text-2xl md:text-3xl w-12 h-12 rounded-full flex items-center justify-center ${category.accent || 'bg-blue-50'}`}>
                        {category.icon || '📁'}
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold font-dmsans">
                        {category.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {(category.subcategories || []).map((sub, jdx) => (
                        <Link
                          key={jdx}
                          to={`/kids-class/${category.slug}/${sub.slug}`}
                          className="bg-white hover:bg-gray-50 flex items-center gap-2 p-3 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-all transform hover:-translate-y-0.5 w-auto"
                        >
                          <span className="text-lg md:text-xl shrink-0">{sub.icon || '🔹'}</span>
                          <span className="font-semibold text-gray-800 text-sm font-dmsans whitespace-nowrap">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchTerm && filteredCategories.length === 0 && searchResults.length === 0 && (
               <div className="text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No matches found</h3>
                <p className="text-gray-500">We couldn't find any classes or categories matching "{searchTerm}"</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Clear search and browse all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
