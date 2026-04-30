import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getFullImageUrl } from "../../utils/imageHelper";

import api from "../../utils/api";

export default function ItTrainingSubcategory() {
  const { categorySlug, subcategorySlug } = useParams();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatSlug = (slug) => {
    return slug
      ? slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";
  };

  useEffect(() => {
    setLoading(true);
    api.get(`/api/it-training?category=${categorySlug}&subcategory=${subcategorySlug}`)
      .then(res => {
        const result = res.data;
        if (result.success) setClasses(result.data);
      })
      .catch(err => console.error("Error fetching IT training:", err))
      .finally(() => setLoading(false));
  }, [categorySlug, subcategorySlug]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-dmsans">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-700 to-indigo-900 text-white py-12 px-[7%] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="text-blue-200 font-bold tracking-widest uppercase text-sm mb-2">Advance Your Career</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {formatSlug(subcategorySlug)} Training
          </h1>
          <p className="text-lg md:text-xl font-medium max-w-2xl opacity-90">
            Learn {formatSlug(subcategorySlug)} from industry experts. Master the tools and technologies used by top tech companies globally.
          </p>
        </div>
      </div>

      <div className="flex-grow w-full px-[7%] py-12">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl text-center border border-gray-100 max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Training Programs Found</h2>
            <p className="text-gray-500 mb-8 font-medium">
              We currently don't have any active {formatSlug(subcategorySlug)} training under {formatSlug(categorySlug)}. Check back soon!
            </p>
            <Link
              to="/it-training"
              className="inline-flex px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all shadow-lg"
            >
              ← Explore Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map(cls => (
              <div key={cls.id} className="bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 overflow-hidden flex flex-col group">
                <div className="p-6 pb-0 flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center relative shrink-0 shadow-inner">
                    {cls.photoUrl ? (
                      <img 
                        src={getFullImageUrl(cls.photoUrl)} 
                        alt={cls.instructorName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-2xl">👨‍💻</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {cls.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wider">Instructed by {cls.instructorName}</p>
                  </div>
                </div>

                <div className="px-6 flex-grow">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {cls.level?.map((l, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                        {l}
                      </span>
                    ))}
                    {cls.format?.map((f, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                        {f}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
                    {cls.short_description || "Take your technical skills to the next level with this intensive, practical training program designed for career growth."}
                  </p>

                  <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 font-bold bg-slate-50 p-4 rounded-2xl border border-gray-100 mb-6">
                    <div className="flex items-center gap-2"><span>⏱</span> {cls.duration_label || '8 Weeks'}</div>
                    <div className="flex items-center gap-2"><span>💳</span> {cls.fee_amount ? <span className="text-gray-900">${cls.fee_amount}<span className="text-[10px] text-gray-400 font-normal ml-1">/{cls.fee_type.replace('_',' ')}</span></span> : 'Quote on Request'}</div>
                  </div>
                </div>

                <div className="p-6 pt-0 mt-auto">
                  <Link 
                    to={`/it-training/details/${cls.id}`}
                    className="flex justify-center items-center w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/10 transition-all font-dmsans tracking-wide"
                  >
                    View Program Details
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
