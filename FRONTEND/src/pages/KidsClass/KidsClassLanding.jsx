import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LocationSelectorModal from "../../components/LocationSelectorModal";
import api from "../../utils/api";

export default function KidsClassLanding() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
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
    fetchCats();
  }, []);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setShowLocationModal(false);
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
      <div className="bg-gradient-to-r from-blue-100 via-[#e0f2fe] to-pink-100 py-10 px-[7%] relative overflow-hidden">
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

          <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Search for languages, math, music..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-12 pr-6 rounded-full border-2 border-white shadow-md focus:outline-none focus:border-[#ffa41c] text-base font-dmsans transition-colors"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">
                🔍
              </span>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
           <span className="text-9xl">🎒</span>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="flex-grow w-full px-[7%] py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-8">
            {filteredCategories.map((category, idx) => (
              <div key={idx} className={`p-5 md:p-6 rounded-2xl ${category.color} shadow-sm border`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`text-2xl md:text-3xl w-12 h-12 rounded-full flex items-center justify-center ${category.accent}`}>
                    {category.icon}
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-dmsans">
                    {category.name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {(category.subcategories || []).map((sub, jdx) => (
                    <Link
                      key={jdx}
                      to={`/kids-class/${category.slug}/${sub.slug}`}
                      className="bg-white hover:bg-gray-50 flex flex-nowrap items-center gap-2 p-3 rounded-xl shadow-sm border border-black/5 hover:shadow-md transition-all transform hover:-translate-y-0.5"
                    >
                      <span className="text-lg md:text-xl shrink-0">{sub.icon || '🔹'}</span>
                      <span className="font-semibold text-gray-800 text-sm font-dmsans truncate">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium text-xl">
            No classes found matching "{searchTerm}" 😔
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
