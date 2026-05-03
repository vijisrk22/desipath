import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { getFullImageUrl } from "../../utils/imageHelper";
import { CircularProgress, Button, Tab, Tabs, Box } from "@mui/material";

export default function PhotographerDetails() {
  const { id } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/api/photography/details/${id}`);
        if (res.data.success) {
          setPhotographer(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10">
        <h1 className="text-2xl font-bold text-gray-700">Profile not found</h1>
        <Link to="/services/photography" className="mt-4 text-blue-600 font-bold underline">Back to Search</Link>
      </div>
    );
  }

  const backdropImage = photographer.backdrop_photo
    ? getFullImageUrl(photographer.backdrop_photo)
    : "/img/photography/default_backdrop.png";

  const profileImage = photographer.profile_photo
    ? getFullImageUrl(photographer.profile_photo)
    : "/img/photography/default_profile.png";

  // Simple YouTube parser
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getEmbedUrl(photographer.video_url);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[450px]">
        <img 
          src={backdropImage} 
          alt="Backdrop" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <div className="absolute bottom-[-60px] left-[7%] flex flex-col md:flex-row items-end md:items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            </div>
            {photographer.status === 'active' && (
              <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 bg-green-500 border-4 border-white rounded-full" />
            )}
          </div>
          <div className="mb-8 hidden md:block">
            <h1 className="text-4xl font-black text-white drop-shadow-lg font-dmsans">{photographer.title}</h1>
            <div className="flex items-center gap-3 mt-2">
               <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-white uppercase border border-white/30">
                  {photographer.service_type}
               </span>
               <span className="text-white/90 font-bold text-sm">📍 {photographer.locations?.[0]?.city}, {photographer.locations?.[0]?.state}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Title Section */}
      <div className="md:hidden pt-20 px-[7%] pb-4 border-b">
         <h1 className="text-3xl font-black text-gray-900 font-dmsans">{photographer.title}</h1>
         <div className="flex items-center gap-2 mt-2">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                {photographer.service_type}
            </span>
            <span className="text-gray-500 font-bold text-xs">📍 {photographer.locations?.[0]?.city}</span>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-16 md:mt-24 px-[7%] pb-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Info */}
        <div className="lg:col-span-8">
           <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}>
             <Tab label="About" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
             <Tab label="Packages" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
             <Tab label="Showreel" sx={{ fontWeight: 'bold', textTransform: 'none' }} />
           </Tabs>

           {tab === 0 && (
             <div className="animate-fade-in">
               <h2 className="text-2xl font-bold mb-6 text-gray-800">Biography</h2>
               <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                 {photographer.bio}
               </p>
               
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12 bg-slate-50 p-8 rounded-[32px]">
                 <div>
                   <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Experience</span>
                   <span className="text-xl font-black text-[#007185]">{photographer.experience_years} Years</span>
                 </div>
                 <div>
                   <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Languages</span>
                   <span className="text-xl font-black text-[#007185]">{photographer.languages || 'English'}</span>
                 </div>
                 <div>
                   <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Service area</span>
                   <span className="text-xl font-black text-[#007185]">100 miles</span>
                 </div>
               </div>
             </div>
           )}

           {tab === 1 && (
             <div className="animate-fade-in space-y-6">
               <h2 className="text-2xl font-bold mb-6 text-gray-800">Service Packages</h2>
               {photographer.packages?.map((pkg, idx) => (
                 <div key={idx} className="bg-white border-2 border-gray-100 p-8 rounded-[32px] hover:border-blue-500 transition-all group">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                     <h3 className="text-2xl font-black text-gray-900">{pkg.name}</h3>
                     <span className="text-3xl font-black text-blue-600">₹{Number(pkg.price).toLocaleString("en-IN")}</span>
                   </div>
                   <p className="text-gray-600 font-medium leading-relaxed">
                     {pkg.description}
                   </p>
                 </div>
               ))}
             </div>
           )}

           {tab === 2 && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Video Showreel</h2>
                {embedUrl ? (
                  <div className="relative pt-[56.25%] rounded-[32px] overflow-hidden shadow-2xl border-4 border-gray-100">
                    <iframe 
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full"
                      allowFullScreen
                      title="Showreel"
                    />
                  </div>
                ) : (
                  <div className="py-20 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                    <span className="text-6xl mb-4 block">🎬</span>
                    <p className="text-gray-400 font-bold">No video showreel available for this profile.</p>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* Right Column - Booking/Action */}
        <div className="lg:col-span-4">
           <div className="sticky top-24 p-8 bg-white border border-gray-100 rounded-[40px] shadow-2xl shadow-blue-900/5">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Contact {photographer.user?.name?.split(' ')[0]}</h3>
              
              <div className="space-y-4">
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    borderRadius: 57, 
                    py: 2, 
                    fontSize: '1rem', 
                    fontWeight: 'bold',
                    backgroundColor: '#007185',
                    '&:hover': { backgroundColor: '#005b6a' }
                  }}
                >
                  Message Photographer
                </Button>
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Secure messaging via Desipath
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-50">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Locations Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {photographer.locations?.map((loc, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold">
                       {loc.city}, {loc.state} {loc.zipcode}
                    </span>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
