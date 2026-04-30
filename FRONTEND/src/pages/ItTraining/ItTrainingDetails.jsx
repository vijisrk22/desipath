import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { getFullImageUrl } from "../../utils/imageHelper";

export default function ItTrainingDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryParams, setEnquiryParams] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/it-training/${id}`)
      .then(res => {
        const result = res.data;
        if (result.success) setData(result.data);
      })
      .catch(err => console.error("Error fetching IT training details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryParams.name || !enquiryParams.email) return alert("Name and Email are required");
    setTimeout(() => {
      setEnquirySent(true);
      setEnquiryParams({ name: '', email: '', phone: '', message: '' });
    }, 800);
  };

  const renderBadgeList = (list, colorClass = "bg-gray-100 border text-gray-700") => {
    if (!list || list.length === 0) return <span className="text-gray-400 italic">None</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => (
          <span key={idx} className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderCheckList = (list) => {
    if (!list || list.length === 0) return null;
    return (
      <ul className="space-y-3 mt-4">
        {list.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-700 font-medium">
            <span className="text-blue-600 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0">✔</span> 
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
         <Navbar />
         <div className="flex-grow flex justify-center p-32">
           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
         </div>
         <Footer newsletter="block"/>
       </div>
     );
  }

  if (!data) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
         <Navbar />
         <div className="flex-grow flex flex-col items-center justify-center p-8">
           <div className="text-8xl mb-6">🛰️</div>
           <h2 className="text-3xl font-black text-blue-900 mb-2">Training Program No Longer Available</h2>
           <p className="text-gray-500 mb-8">This program might have been completed or moved by the instructor.</p>
           <Link to="/it-training" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1">
             Back to Marketplace
           </Link>
         </div>
         <Footer newsletter="block"/>
       </div>
     );
  }

  const { classBasic, instructor, schedule, about, pricing, reqs, modules } = data;

  return (
    <div className="min-h-screen bg-slate-50 font-dmsans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 font-dmsans">
        
        {/* Modern Header Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col md:flex-row gap-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-3xl shadow-2xl border-4 border-white shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center mx-auto md:mx-0 relative z-10">
            {instructor.profile_photo_url ? (
               <img 
                 src={getFullImageUrl(instructor.profile_photo_url)} 
                 alt={instructor.name} 
                 className="w-full h-full object-cover" 
               />
            ) : (
               <span className="text-7xl">👨‍💻</span>
            )}
          </div>
          
          <div className="flex-grow text-center md:text-left relative z-10">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
               <span className="px-4 py-1.5 bg-blue-900 text-white text-xs font-bold rounded-xl uppercase tracking-widest">{classBasic.category}</span>
               <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl uppercase tracking-widest border border-blue-100">{classBasic.subcategory}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-blue-900 mb-3 leading-tight tracking-tight">{classBasic.title}</h1>
            <div className="flex items-center gap-2 justify-center md:justify-start text-xl font-bold mb-6">
              <span className="text-gray-400">Led by</span>
              <span className="text-blue-600 underline decoration-blue-200 underline-offset-4">{instructor.name}</span>
            </div>
            <p className="text-gray-600 text-lg max-w-3xl font-medium leading-relaxed italic border-l-4 border-blue-100 pl-6">{classBasic.short_description}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-slate-50 rounded-3xl p-8 border border-slate-100 shrink-0 text-center shadow-inner min-w-[240px] relative z-10">
            <p className="text-gray-400 uppercase font-black text-[10px] tracking-widest mb-2">Investment</p>
            <h2 className="text-5xl font-black text-blue-900 mb-1 flex items-start">
              <span className="text-2xl mt-2 mr-1 opacity-50">$</span>{pricing?.fee_amount || 'Custom'}
            </h2>
            <p className="text-gray-400 font-bold text-xs mb-8 uppercase tracking-tighter">/{pricing?.fee_type?.replace('_', ' ') || 'Program'}</p>
            <button 
              onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })}
              className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-2xl font-bold transition-all hover:-translate-y-1 active:scale-95"
            >
              Reserve My Spot
            </button>
            <p className="text-[10px] text-gray-400 mt-4 font-bold uppercase">{pricing?.certificate_provided ? '🏆 Certification Included' : 'No Certification'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="col-span-1 lg:col-span-2 space-y-10">
             
             {/* Program Overview */}
             <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="text-2xl font-black text-blue-900 border-b border-slate-50 pb-6 mb-8 uppercase tracking-wider text-sm flex items-center gap-3">
                 <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">📄</span>
                 Program Roadmap
               </h3>
               <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-10 font-medium text-lg">{about?.detailed_description || 'No detailed description provided.'}</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                   <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-4">Learning Objectives</h4>
                   {renderCheckList(about?.what_will_learn)}
                 </div>
                 <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                   <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-4">Program Highlights</h4>
                   {renderCheckList(about?.highlights)}
                 </div>
               </div>
             </section>

             {/* Curriculum Timeline */}
             {modules && modules.length > 0 && (
                <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black text-blue-900 border-b border-slate-50 pb-6 mb-8 uppercase tracking-wider text-sm flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">🛠️</span>
                    Technical Curriculum
                  </h3>
                  <div className="space-y-6">
                    {modules.map((mod, i) => (
                      <div key={i} className="flex gap-6 p-6 rounded-3xl bg-blue-50/30 border border-blue-50 hover:bg-blue-50/50 transition-all group">
                        <div className="w-14 h-14 bg-white text-blue-600 font-black rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">{i + 1}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-xl mb-1">{mod.title}</h4>
                          <div className="flex items-center gap-2 mb-3">
                             <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black rounded uppercase tracking-tighter">{mod.estimated_duration || 'Self-Paced'}</span>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed font-medium">{mod.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
             )}

             {/* Technical Prerequisites */}
             {reqs && (
               <section className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
                 <h3 className="text-2xl font-black text-blue-900 border-b border-slate-50 pb-6 mb-8 uppercase tracking-wider text-sm flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">⚙️</span>
                    Pre-requisites & Setup
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   
                   {reqs.prerequisites?.length > 0 && (
                     <div>
                       <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4">Background</h4>
                       <ul className="space-y-3 text-gray-700 font-bold text-sm">
                         {reqs.prerequisites.map((req, idx) => <li key={idx} className="flex gap-2"><span>•</span> {req}</li>)}
                       </ul>
                     </div>
                   )}

                   {reqs.materials_needed?.length > 0 && (
                     <div>
                       <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4">Tools & Software</h4>
                       <ul className="space-y-3 text-gray-700 font-bold text-sm">
                         {reqs.materials_needed.map((item, idx) => <li key={idx} className="flex gap-2"><span>•</span> {item}</li>)}
                       </ul>
                     </div>
                   )}

                   {reqs.tech_requirements?.length > 0 && (
                     <div>
                       <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4">Hardware</h4>
                       <ul className="space-y-3 text-gray-700 font-bold text-sm">
                         {reqs.tech_requirements.map((tech, idx) => <li key={idx} className="flex gap-2"><span>•</span> {tech}</li>)}
                       </ul>
                     </div>
                   )}
                 </div>
               </section>
             )}
          </div>

          <div className="col-span-1 space-y-8">
            
            {/* Training Stats */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Program Logistics</h3>
               <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                   <span className="text-gray-500 font-bold text-xs uppercase tracking-tight">Total Duration</span>
                   <span className="font-black text-blue-900">{schedule?.duration_label || '8 Weeks'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                   <span className="text-gray-500 font-bold text-xs uppercase tracking-tight">Batch Start</span>
                   <span className="font-black text-blue-900">{schedule?.batch_start_date || 'Ongoing'}</span>
                 </div>
                 <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                   <span className="text-gray-500 font-bold text-xs uppercase tracking-tight">Session Timing</span>
                   <span className="font-black text-blue-900">{schedule?.time_start ? `${schedule.time_start} - ${schedule.time_end}` : 'Flexible'}</span>
                 </div>
                 <div className="space-y-3">
                   <span className="text-gray-500 font-bold text-xs uppercase tracking-tight block">Training Schedule</span>
                   <div className="flex flex-wrap gap-2">
                     {schedule?.days_of_week?.map(day => (
                        <span key={day} className="w-10 h-10 bg-blue-900 text-white rounded-xl flex items-center justify-center font-bold text-xs shadow-lg shadow-blue-900/20">{day}</span>
                     ))}
                   </div>
                 </div>
                 <div className="pt-4">
                   <span className="text-gray-500 font-bold text-xs uppercase tracking-tight block mb-3">Target Skill Level</span>
                   {renderBadgeList(classBasic.level, "bg-indigo-50 border-indigo-100 text-indigo-700")}
                 </div>
               </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-blue-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/30">
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">👨‍🏫</div>
                 <div>
                   <h3 className="font-black text-lg">Expert Instructor</h3>
                   <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">{instructor.years_experience ? `${instructor.years_experience}+ Years in Industry` : 'Technical Expert'}</p>
                 </div>
               </div>
               <p className="text-blue-100 text-sm leading-relaxed font-medium italic opacity-80 line-clamp-6 mb-8">"{instructor.bio || 'Industry professional with extensive hands-on expertise in technical training and project leadership.'}"</p>
               <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
            </div>

            {/* Request More Info Form */}
            <div id="enquiry-form" className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-gray-100">
               <h3 className="text-2xl font-black text-blue-900 mb-6">Request Syllabus</h3>
               
               {enquirySent ? (
                 <div className="bg-emerald-50 text-emerald-700 p-8 rounded-3xl text-center font-bold border border-emerald-100 animate-fade-in">
                   <div className="text-5xl mb-4">📩</div>
                   <p className="text-lg">Request Received!</p>
                   <div className="text-xs font-bold uppercase opacity-60 mt-2">The instructor will reach out within 24 hours.</div>
                 </div>
               ) : (
                 <form onSubmit={handleEnquiry} className="space-y-4">
                   <input 
                     type="text" 
                     placeholder="Your Professional Name *"
                     required
                     value={enquiryParams.name}
                     onChange={e => setEnquiryParams({...enquiryParams, name: e.target.value})}
                     className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold bg-slate-50 transition-all"
                   />
                   <input 
                     type="email" 
                     placeholder="Professional Email *"
                     required
                     value={enquiryParams.email}
                     onChange={e => setEnquiryParams({...enquiryParams, email: e.target.value})}
                     className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold bg-slate-50 transition-all"
                   />
                   <input 
                     type="tel" 
                     placeholder="Phone (Optional)"
                     value={enquiryParams.phone}
                     onChange={e => setEnquiryParams({...enquiryParams, phone: e.target.value})}
                     className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold bg-slate-50 transition-all"
                   />
                   <textarea 
                     rows="4"
                     placeholder="Share your learning goals or ask for prerequisites..."
                     value={enquiryParams.message}
                     onChange={e => setEnquiryParams({...enquiryParams, message: e.target.value})}
                     className="w-full p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-bold bg-slate-50 transition-all"
                   ></textarea>
                   <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1">
                     Download Full Syllabus
                   </button>
                 </form>
               )}
            </div>

          </div>
        </div>

      </main>

      <Footer newsletter={"block"} />
    </div>
  );
}
