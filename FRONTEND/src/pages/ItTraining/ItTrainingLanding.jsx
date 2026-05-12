import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import LocationSelectorModal from "../../components/LocationSelectorModal";
import api from "../../utils/api";

export default function ItTrainingLanding() {
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
        const res = await api.get('/api/marketplace/categories?module=it_training');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch IT categories", err);
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

  const bgColors = [
    'bg-indigo-100/70 border-indigo-200',
    'bg-emerald-100/70 border-emerald-200',
    'bg-amber-100/70 border-amber-200',
    'bg-rose-100/70 border-rose-200',
    'bg-blue-100/70 border-blue-200',
    'bg-purple-100/70 border-purple-200'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />

      {/* Hero / Banner Section */}
      <div className="bg-gradient-to-r from-blue-100 via-[#e0f2fe] to-indigo-100 py-4 md:py-6 px-[7%] relative overflow-hidden">
        <div className="absolute top-4 right-[7%] z-20 hidden md:block">
          <Link 
            to="/it-training/instructor-portal"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>📢</span>
            Become an IT Instructor
          </Link>
        </div>

        <div className="flex flex-col items-center text-center relative z-10 py-1">
          <h1 className="text-2xl md:text-4xl font-black text-[#003d4d] font-dmsans mb-2 leading-tight">
            Master Next-Gen IT Skills 💻🚀
          </h1>
          <p className="text-sm md:text-lg text-gray-700 font-medium mb-4 max-w-3xl leading-relaxed">
            From Cloud Computing and AI to Cybersecurity and DevOps. Find expert-led training to accelerate your tech career.
          </p>

          <div className="w-full max-w-3xl flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-full max-w-xl relative group">
              <input
                type="text"
                placeholder="Search for AWS, Python, Cybersecurity, React..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-14 pr-8 rounded-full border-2 border-white shadow-xl focus:outline-none focus:border-blue-500 text-base md:text-lg font-dmsans transition-all group-hover:shadow-blue-200"
              />
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl group-hover:scale-110 transition-transform">
                🔍
              </span>
            </div>
          </div>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block">
           <span className="text-9xl">📡</span>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="flex-grow w-full px-[7%] py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="space-y-12">
            {filteredCategories.map((category, idx) => (
              <div key={idx} className={`p-5 md:p-6 rounded-2xl ${bgColors[idx % bgColors.length]} shadow-sm border`}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`text-xl md:text-2xl w-10 h-10 rounded-xl flex items-center justify-center ${category.accent || 'bg-gray-100'} shadow-inner`}>
                    {category.icon || '📘'}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black font-dmsans tracking-tight text-gray-900">
                      {category.name}
                    </h2>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 opacity-60">Featured Specializations</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {(category.subcategories || []).map((sub, jdx) => (
                    <Link
                      key={jdx}
                      to={`/it-training/${category.slug}/${sub.slug}`}
                      className="bg-white hover:bg-blue-50 flex items-center gap-3 p-3 rounded-xl shadow-sm border border-black/5 hover:shadow-lg transition-all transform hover:-translate-y-1 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-base group-hover:bg-white group-hover:scale-110 transition-all shrink-0">
                        {sub.icon || '🔹'}
                      </div>
                      <span className="font-normal text-gray-800 text-xs md:text-sm font-dmsans leading-tight">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-500 font-medium text-xl bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-inner">
            <div className="text-6xl mb-4 opacity-20">🔍</div>
            No training programs found matching "{searchTerm}"
            <p className="text-sm mt-3 font-bold text-gray-400">Try searching for broader terms like "Programming" or "Cloud"</p>
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
