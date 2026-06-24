import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getFullImageUrl } from "../../utils/imageHelper";

import api from "../../utils/api";

export default function KidsClassSubcategory() {
  const { categorySlug, subcategorySlug } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to make slugs pretty for display
  const formatSlug = (slug) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/api/kids-classes/public/category/${categorySlug}/${subcategorySlug}`)
      .then(res => {
        const result = res.data;
        if (result.success) setClasses(result.data);
      })
      .catch(err => console.error("Error fetching classes:", err))
      .finally(() => setLoading(false));
  }, [categorySlug, subcategorySlug]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f0f8ff] font-dmsans">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-8 px-[7%] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-blue-200 font-bold tracking-widest uppercase text-sm mb-2">Explore the Best</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {formatSlug(subcategorySlug)} Classes
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl opacity-90">
            Find the perfect instructor to help your child excel in {formatSlug(subcategorySlug)}. Choose from online, offline, and hybrid batches!
          </p>
        </div>
      </div>

      <div className="flex-grow w-full px-[7%] py-12">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-sm text-center border border-gray-100">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Classes Found</h2>
            <p className="text-gray-500 mb-8">
              We currently don't have any active {formatSlug(subcategorySlug)} classes under {formatSlug(categorySlug)}. Check back later!
            </p>
            <Link
              to="/kids-class"
              className="inline-flex px-8 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full font-bold transition-colors"
            >
              ← Back to Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map(cls => (
              <div key={cls.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col group">
                <div className="p-6 pb-0 flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center relative shrink-0">
                    {cls.photoUrl ? (
                      <img 
                        src={getFullImageUrl(cls.photoUrl)} 
                        alt={cls.instructorName} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.style.display='none'; e.target.parentNode.innerText='📸'; e.target.parentNode.classList.add('text-2xl'); }}
                      />
                    ) : (
                      <span className="text-2xl">📸</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {cls.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mt-1">by {cls.instructorName}</p>
                  </div>
                </div>

                <div className="px-6 flex-grow">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {cls.format?.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg border">
                        {f}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                      Ages {cls.age_group_min}-{cls.age_group_max}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {cls.short_description || "Join this exciting class to learn and master new skills with a professional instructor!"}
                  </p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
                    <div className="flex items-center gap-2"><span>🗓</span> {cls.duration_label || 'Varies'}</div>
                    <div className="flex items-center gap-2"><span>💸</span> {cls.fee_amount ? <span className="font-bold text-gray-800"><span className="text-[10px] align-top mr-0.5">₹</span>{cls.fee_amount}<span className="text-[10px] text-gray-400 font-normal ml-1">/{cls.fee_type.replace('_',' ')}</span></span> : 'Contact for Price'}</div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link 
                    to={`/kids-class/details/${cls.id}`}
                    className="flex justify-center items-center w-full py-3 bg-[#0857d0] hover:bg-[#0746a8] text-white font-bold rounded-xl shadow-md shadow-blue-500/10 transition-all font-dmsans tracking-wide text-sm"
                  >
                    View Details & Enroll
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
