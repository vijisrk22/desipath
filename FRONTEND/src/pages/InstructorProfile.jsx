import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import api from '../utils/api';
import { getFullImageUrl } from '../utils/imageHelper';

export default function InstructorProfile({ type }) {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const endpoint = type === 'it' 
            ? `/api/it-training/instructor/${slug}` 
            : `/api/kids-classes/instructor/${slug}`;
            
        const res = await api.get(endpoint);
        if (res.data.success) {
          setData({ ...res.data.data, type: type });
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        setError('Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-bold text-blue-900 animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-10">
          <div className="text-9xl mb-6">🔍</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Instructor Not Found</h1>
          <p className="text-gray-500 mb-8 text-center max-w-md">We couldn't find the instructor profile you're looking for. It might have been removed or the URL is incorrect.</p>
          <Link to="/" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all">Go Back Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const { instructor, classes } = data;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
      <Navbar />
      
      {/* Premium Header Backdrop */}
      <div className="h-64 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 -mt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar: Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-8 border border-gray-100 sticky top-24">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-40 h-40 rounded-full border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                    {instructor.profile_photo_url ? (
                      <img 
                        src={getFullImageUrl(instructor.profile_photo_url)} 
                        alt={instructor.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl bg-blue-50 text-blue-400 font-bold uppercase">
                        {instructor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-emerald-500 border-4 border-white rounded-full" title="Available"></div>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{instructor.name}</h1>
                <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">
                  {data.type === 'it' ? 'IT Specialist Trainer' : 'Expert Kids Educator'}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">
                    {instructor.years_experience}+ Years Exp
                  </span>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase">
                    {instructor.account_type}
                  </span>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="text-xl">📍</span>
                    <span className="text-sm font-medium">{instructor.city ? `${instructor.city}, ${instructor.state}` : 'Global Trainer'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="text-xl">✉️</span>
                    <span className="text-sm font-medium">{instructor.email}</span>
                  </div>
                </div>

                <button className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 active:scale-95">
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>

          {/* Main Content: Bio & Listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-8 md:p-10 border border-gray-100">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
                About the Instructor
              </h2>
              <div className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {instructor.bio || "This instructor hasn't provided a detailed bio yet, but their expertise and course quality speak for themselves."}
              </div>
            </div>

            {/* Courses Card */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                  <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                  Active Listings ({classes.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.length > 0 ? (
                  classes.map((cls) => (
                    <Link 
                      key={cls.id} 
                      to={data.type === 'it' ? `/it-training/details/${cls.id}` : `/kids-class/details/${cls.id}`}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
                    >
                      <div className="h-40 bg-slate-100 relative overflow-hidden">
                        {cls.thumbnail_url ? (
                          <img 
                            src={getFullImageUrl(cls.thumbnail_url)} 
                            alt={cls.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-300">
                            <span className="text-6xl">{data.type === 'it' ? '💻' : '🎨'}</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
                            {cls.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                        <h3 className="font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                          {cls.title}
                        </h3>
                        <div className="mt-auto space-y-4">
                          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            <span>{cls.duration_label || '8 Weeks'}</span>
                            <span className="text-emerald-500">{cls.fee_amount ? `$${cls.fee_amount}` : 'Free'}</span>
                          </div>
                          <div className="w-full py-2 border-t border-gray-50 text-center text-blue-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details →
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-lg">No active listings found for this trainer.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
