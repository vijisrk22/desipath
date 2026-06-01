import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { getFullImageUrl } from "../../utils/imageHelper";

export default function KidsClassDetails() {
  const { id: idParam } = useParams();
  const id = idParam ? idParam.split('-')[0] : null;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enquiryParams, setEnquiryParams] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquirySent, setEnquirySent] = useState(false);

  useEffect(() => {
    api.get(`/api/kids-classes/public/details/${id}`)
      .then(res => {
        const result = res.data;
        if (result.success) setData(result.data);
      })
      .catch(err => console.error("Error fetching class details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnquiry = (e) => {
    e.preventDefault();
    if (!enquiryParams.name || !enquiryParams.email) return alert("Name and Email are required");
    // Pseudo backend submission (Mocking an API hit)
    setTimeout(() => {
      setEnquirySent(true);
      setEnquiryParams({ name: '', email: '', phone: '', message: '' });
    }, 800);
  };

  const renderBadgeList = (list) => {
    if (!list || list.length === 0) return <span className="text-gray-400 italic">None selected</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {list.map((item, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 border text-gray-700 rounded-full text-xs font-bold">
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderCheckList = (list) => {
    if (!list || list.length === 0) return null;
    return (
      <ul className="space-y-2 mt-3">
        {list.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-gray-700">
            <span className="text-green-500 mt-1">✔</span> <span>{item}</span>
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
           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
         <Footer newsletter="block"/>
       </div>
     );
  }

  if (!data) {
     return (
       <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
         <Navbar />
         <div className="flex-grow flex items-center justify-center p-8">
           <h2 className="text-2xl font-bold text-gray-400">Class No Longer Available</h2>
         </div>
         <Footer newsletter="block"/>
       </div>
     );
  }

  const { classBasic, instructor, schedule, about, pricing, reqs, modules } = data;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-dmsans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 py-7 font-dmsans">
        
        {/* Top Banner section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-7 mb-7">
          <div className="w-28 h-28 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center mx-auto md:mx-0 relative">
            {instructor.profile_photo_url ? (
               <img 
                 src={getFullImageUrl(instructor.profile_photo_url)} 
                 alt={instructor.name} 
                 className="w-full h-full object-cover" 
                 onError={(e) => {
                   e.target.style.display = 'none';
                   e.target.parentElement.innerHTML = `<span class="text-6xl text-gray-400">📸</span>`;
                 }}
               />
            ) : (
               <span className="text-6xl text-gray-400">📸</span>
            )}
          </div>
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
               <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg">{classBasic.category} → {classBasic.subcategory}</span>
               {classBasic.format.map(f => <span key={f} className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-bold rounded-lg">{f}</span>)}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{classBasic.title}</h1>
            <p className="text-xl text-gray-600 font-medium mb-4">Instructor: <span className="text-blue-600 font-bold">{instructor.name}</span></p>
            <p className="text-gray-700 text-base max-w-3xl">{classBasic.short_description}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-5 border shrink-0 text-center">
            <p className="text-gray-500 uppercase font-bold text-xs tracking-wider mb-1">Pricing</p>
            <h2 className="text-4xl font-extrabold text-green-600 mb-1">
              <span className="text-2xl align-top mr-0.5">₹</span>{pricing?.fee_amount || 'Custom'}
            </h2>
            <p className="text-gray-500 font-medium text-sm mb-4">/{pricing?.fee_type?.replace('_', ' ') || 'Term'}</p>
            <button 
              onClick={() => document.getElementById('enquiry-form').scrollIntoView({ behavior: 'smooth' })}
              className="w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 rounded-xl font-bold transition-all hover:-translate-y-0.5"
            >
              Send Enquiry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          
          {/* Main Left Content */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
             
             {/* About Class */}
             <section className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-5">About the Class</h3>
               <p className="text-gray-700 whitespace-pre-line leading-relaxed mb-7">{about?.detailed_description || 'No detailed description provided.'}</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                 <div>
                   <h4 className="font-bold text-gray-900 text-lg">What kids will learn:</h4>
                   {renderCheckList(about?.what_will_kids_learn)}
                 </div>
                 <div>
                   <h4 className="font-bold text-gray-900 text-lg">Highlights:</h4>
                   {renderCheckList(about?.highlights)}
                 </div>
               </div>
             </section>

             {/* Curriculum */}
             {modules && modules.length > 0 && (
                <section className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-5">Curriculum Roadmap</h3>
                  <div className="space-y-4">
                    {modules.map((mod, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                        <div className="w-11 h-11 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center shrink-0 text-lg">{mod.sort_order}</div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{mod.title}</h4>
                          <p className="text-blue-600 font-semibold text-sm mb-2">{mod.estimated_duration ? `Duration: ${mod.estimated_duration}` : ''}</p>
                          <p className="text-gray-700 text-sm">{mod.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
             )}

             {/* Requirements & Setup */}
             {reqs && (
               <section className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 mt-7">
                 <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-5">Requirements & Setup</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                   
                   {reqs.prerequisites?.length > 0 && (
                     <div>
                       <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><span>🎯</span> Prerequisites</h4>
                       <ul className="space-y-2 text-gray-700 list-disc ml-5">
                         {reqs.prerequisites.map((req, idx) => <li key={idx}>{req}</li>)}
                       </ul>
                     </div>
                   )}

                   {reqs.materials_needed?.length > 0 && (
                     <div>
                       <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><span>🎒</span> Materials Needed</h4>
                       <ul className="space-y-2 text-gray-700 list-disc ml-5">
                         {reqs.materials_needed.map((item, idx) => <li key={idx}>{item}</li>)}
                       </ul>
                     </div>
                   )}

                   {reqs.tech_requirements?.length > 0 && (
                     <div>
                       <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><span>💻</span> Tech Requirements</h4>
                       <ul className="space-y-2 text-gray-700 list-disc ml-5">
                         {reqs.tech_requirements.map((tech, idx) => <li key={idx}>{tech}</li>)}
                       </ul>
                     </div>
                   )}

                   {reqs.parental_involvement && reqs.parental_involvement !== 'none' && (
                     <div>
                       <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2"><span>👨‍👩‍👧</span> Parental Involvement</h4>
                       <p className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-md text-[11px] font-bold capitalize">
                         {reqs.parental_involvement} Involvement Required
                       </p>
                     </div>
                   )}

                 </div>
                 {/* Fallback if all are empty */}
                 {(!reqs.prerequisites?.length && !reqs.materials_needed?.length && !reqs.tech_requirements?.length && (!reqs.parental_involvement || reqs.parental_involvement === 'none')) && (
                   <p className="text-gray-500 italic">No special requirements for this class!</p>
                 )}
               </section>
             )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-7">
            
            {/* Class Logistics */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Class Logistics</h3>
               <ul className="space-y-4 text-sm text-gray-700">
                 <li className="flex gap-3"><span className="text-gray-400">⏱</span> <span className="font-semibold w-24">Duration:</span> {schedule?.duration_label || 'Varies'}</li>
                 <li className="flex gap-3"><span className="text-gray-400">📅</span> <span className="font-semibold w-24">Starts:</span> {schedule?.batch_start_date || 'Open Enrollment'}</li>
                 <li className="flex gap-3"><span className="text-gray-400">⏰</span> <span className="font-semibold w-24">Timings:</span> {schedule?.time_start ? `${schedule.time_start} - ${schedule.time_end}` : 'TBD'}</li>
                 <li className="flex gap-3"><span className="text-gray-400">📆</span> <span className="font-semibold w-24">Days:</span> <div className="mt-1">{renderBadgeList(schedule?.days_of_week)}</div></li>
                 <li className="flex gap-3"><span className="text-gray-400">🧑‍🎓</span> <span className="font-semibold w-24">Ages:</span> {classBasic.age_group_min} to {classBasic.age_group_max} Years</li>
                 <li className="flex gap-3"><span className="text-gray-400">🚀</span> <span className="font-semibold w-24">Level:</span> <div className="mt-1">{renderBadgeList(classBasic.level)}</div></li>
               </ul>
            </div>

            {/* Instructor Profile snippet */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl border border-blue-100">
               <h3 className="text-lg font-bold text-blue-900 mb-2">Meet the Instructor</h3>
               <p className="text-sm font-bold text-blue-700 mb-3">{instructor.years_experience ? `${instructor.years_experience}+ Years Experience` : ''}</p>
               <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-4">{instructor.bio || 'This instructor has not provided a detailed bio yet.'}</p>
            </div>

            {/* Enquiry Form */}
            <div id="enquiry-form" className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transform md:-rotate-1 relative">
               <div className="absolute top-0 right-0 -m-3 text-4xl">✉️</div>
               <h3 className="text-xl font-bold text-gray-900 mb-4 pr-10">Interested? Contact {instructor.name.split(' ')[0]}</h3>
               
               {enquirySent ? (
                 <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center font-bold border border-green-200">
                   <div className="text-4xl mb-2">📨</div>
                   Your enquiry was sent!
                   <div className="text-sm font-medium mt-1">The instructor will email you shortly.</div>
                 </div>
               ) : (
                 <form onSubmit={handleEnquiry} className="space-y-4">
                   <input 
                     type="text" 
                     placeholder="Your Name *"
                     required
                     value={enquiryParams.name}
                     onChange={e => setEnquiryParams({...enquiryParams, name: e.target.value})}
                     className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                   />
                   <div className="grid grid-cols-2 gap-3">
                     <input 
                       type="email" 
                       placeholder="Email *"
                       required
                       value={enquiryParams.email}
                       onChange={e => setEnquiryParams({...enquiryParams, email: e.target.value})}
                       className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                     />
                     <input 
                       type="tel" 
                       placeholder="Phone"
                       value={enquiryParams.phone}
                       onChange={e => setEnquiryParams({...enquiryParams, phone: e.target.value})}
                       className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                     />
                   </div>
                   <textarea 
                     rows="3"
                     placeholder="Say hi and ask your questions..."
                     value={enquiryParams.message}
                     onChange={e => setEnquiryParams({...enquiryParams, message: e.target.value})}
                     className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50"
                   ></textarea>
                   <button type="submit" className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors">
                     Submit Enquiry
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
