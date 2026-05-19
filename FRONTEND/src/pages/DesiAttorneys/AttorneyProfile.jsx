import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { CircularProgress } from "@mui/material";
import { getFullImageUrl } from "../../utils/imageHelper";

const PROFILE_TABS = [
  { id: "bio", label: "Full Biography", icon: "👤" },
  { id: "career", label: "Career Summary", icon: "📈" },
  { id: "nri", label: "NRI Services", icon: "🌐" },
  { id: "note", label: "Personal Note", icon: "📝" },
  { id: "publications", label: "Publications & Blogs", icon: "📚" }
];

export default function AttorneyProfile() {
  const { slug } = useParams();
  const [attorney, setAttorney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bio");

  useEffect(() => {
    const fetchAttorney = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/attorneys/${slug}`);
        if (res.data.success) {
          setAttorney(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch attorney details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttorney();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-32">
          <CircularProgress size={60} sx={{ color: '#b45309' }} />
          <p className="mt-4 text-slate-500 font-medium">Loading premium legal profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!attorney) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <h2 className="text-2xl font-bold text-slate-800">Attorney Profile Not Found</h2>
          <p className="text-slate-500 max-w-sm mt-2 font-medium">
            The profile you are trying to view does not exist or has been removed.
          </p>
          <Link to="/desi-attorneys" className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2.5 rounded-full">
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageSrc = attorney.profile_photo_url ? getFullImageUrl(attorney.profile_photo_url) : 
    (attorney.gender === 'female' ? '/img/placeholder_female_doc.png' : '/img/placeholder_male_doc.png');

  // Convert youtube url to privacy embed url
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get("v");
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : "";
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-dmsans">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-slate-100 border-b border-slate-200/60 py-3 px-[7%] text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <Link to="/desi-attorneys" className="hover:text-amber-700 transition-colors">Attorneys</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">{attorney.first_name} {attorney.last_name}</span>
        </div>
      </div>

      {/* Shimmer Styles */}
      <style>{`
        @keyframes shimmer-move {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-gold {
          background: linear-gradient(90deg, #b45309 25%, #f59e0b 50%, #b45309 75%);
          background-size: 200% 100%;
          animation: shimmer-move 2.5s infinite linear;
        }
        .shimmer-blue {
          background: linear-gradient(90deg, #1d4ed8 25%, #60a5fa 50%, #1d4ed8 75%);
          background-size: 200% 100%;
          animation: shimmer-move 2.5s infinite linear;
        }
        .shimmer-green {
          background: linear-gradient(90deg, #047857 25%, #34d399 50%, #047857 75%);
          background-size: 200% 100%;
          animation: shimmer-move 2.5s infinite linear;
        }
      `}</style>

      {/* Profile Header Hero */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white py-12 px-[7%] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center relative z-10">
          
          {/* Avatar Container */}
          <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/10 border-4 border-white/20 shadow-xl flex-shrink-0">
            <img 
              src={imageSrc} 
              alt={`${attorney.first_name} ${attorney.last_name}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(attorney.first_name + ' ' + attorney.last_name)}&background=fef3c7&color=b45309&bold=true`;
              }}
            />
          </div>

          {/* Identity & Basic Stats */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <span className="bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Desi Attorney Verified
              </span>
              {attorney.nri_specialisation && (
                <span className="bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  🌐 NRI Client Specialist
                </span>
              )}
              {attorney.india_law_knowledge && (
                <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  ⚖️ India BCI / Law Advisory
                </span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight font-dmsans">
              {attorney.first_name} {attorney.last_name}, {attorney.law_degree || 'JD'}
            </h1>
            <p className="text-amber-400 font-bold uppercase tracking-widest text-sm mt-1">
              🎓 {attorney.law_school || 'Law Graduate'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-slate-300">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-lg">★</span>
                <span className="font-bold text-white">{attorney.avg_rating || '5.00'}</span>
                <span className="text-slate-400 text-xs">({attorney.review_count || 4} Client Reviews)</span>
              </div>
              <span className="hidden md:inline text-slate-700">|</span>
              <p className="text-slate-300">
                🏢 Licensed in: <span className="font-bold text-slate-100">
                  {attorney.states_licensed_json?.map(s => s.state).join(', ') || 'NJ'}
                </span>
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex-shrink-0 w-full md:w-auto text-center flex flex-col gap-3 shadow-lg">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Connect with counsel</span>
            <a 
              href={`mailto:${attorney.email}`}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm py-3 px-6 rounded-xl transition-all shadow-md inline-block"
            >
              ✉️ Email Attorney
            </a>
            {attorney.phone && (
              <a 
                href={`tel:${attorney.phone}`}
                className="text-white hover:text-amber-200 font-bold text-xs underline"
              >
                Call: {attorney.phone}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="max-w-6xl mx-auto w-full px-[7%] py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Tabs Biography */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          
          {/* Navigation Tab list */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap md:flex-nowrap gap-1">
            {PROFILE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-grow md:flex-1 py-2.5 px-3 text-xs font-bold transition-all rounded-xl flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-amber-900 shadow-sm border border-slate-200/40"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40 border border-transparent"
                }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            {activeTab === 'bio' && (
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Professional Biography</h3>
                <div className="whitespace-pre-line">{attorney.full_biography}</div>
              </div>
            )}

            {activeTab === 'career' && (
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Career Summary & Experience</h3>
                {attorney.career_summary ? (
                  <div className="whitespace-pre-line">{attorney.career_summary}</div>
                ) : (
                  <p className="text-slate-400 italic">No career summary provided.</p>
                )}
              </div>
            )}

            {activeTab === 'nri' && (
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-slate-800 mb-2">NRI Clients & India Law Support</h3>
                
                {attorney.nri_client_statement ? (
                  <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 text-sm text-slate-700 leading-relaxed font-medium">
                    <h4 className="font-extrabold text-amber-900 mb-2">🌐 Special Statement for NRI Clients</h4>
                    <p className="whitespace-pre-line">{attorney.nri_client_statement}</p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No NRI special statement provided.</p>
                )}

                {attorney.india_bci && (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm text-slate-700">
                    <h4 className="font-extrabold text-slate-800 mb-1">Bar Council of India Registration</h4>
                    <p className="font-medium text-slate-600">
                      {attorney.india_bci_details || "Registered Advocate with the BCI."}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'note' && (
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-medium">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Personal Note to Clients</h3>
                {attorney.personal_note ? (
                  <div className="whitespace-pre-line italic">"{attorney.personal_note}"</div>
                ) : (
                  <p className="text-slate-400 italic">No personal note provided.</p>
                )}
              </div>
            )}

            {activeTab === 'publications' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Featured Publications</h3>
                  {attorney.publications_json && attorney.publications_json.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {attorney.publications_json.map((pub, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-start">
                          <div>
                            <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full mr-2">
                              {pub.type}
                            </span>
                            <h4 className="font-extrabold text-sm text-slate-800 mt-1">{pub.title}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {pub.publisher} | {pub.date}
                            </p>
                          </div>
                          {pub.url && (
                            <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 font-bold hover:underline">
                              Read Article ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">No publications listed.</p>
                  )}
                </div>

                {attorney.blog_url && (
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-extrabold text-sm text-slate-800 mb-1">Legal Blog</h4>
                    <p className="text-xs text-slate-600 font-medium mb-2">{attorney.blog_description}</p>
                    <a href={attorney.blog_url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 font-bold hover:underline">
                      Visit Blog ({attorney.blog_platform || 'Website'}) ↗
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Credentials and State bar tables */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-800 mb-4 border-b border-slate-50 pb-2">
              ⚖️ Bar Admissions & Jurisdictions
            </h3>
            
            <div className="flex flex-col gap-4 text-xs font-semibold">
              {/* Licenses Table */}
              {attorney.states_licensed_json && attorney.states_licensed_json.length > 0 && (
                <div>
                  <h4 className="font-extrabold text-slate-400 uppercase tracking-wider mb-2">State Bar Licenses</h4>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-2">Jurisdiction</th>
                        <th className="py-2">Bar Number</th>
                        <th className="py-2">Admitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attorney.states_licensed_json.map((lic, idx) => (
                        <tr key={idx} className="border-b border-slate-50 text-slate-600">
                          <td className="py-2.5 font-bold">State Bar of {lic.state}</td>
                          <td className="py-2.5 font-mono">{lic.bar_number || 'N/A'}</td>
                          <td className="py-2.5">{lic.year_admitted || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Federal Admissions list */}
              {(attorney.federal_courts_json || attorney.us_supreme_court || attorney.eoir_admitted || attorney.us_tax_court) && (
                <div className="mt-4">
                  <h4 className="font-extrabold text-slate-400 uppercase tracking-wider mb-2">Federal Admissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {attorney.us_supreme_court && (
                      <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                        🏛️ Supreme Court of the United States (SCOTUS)
                      </span>
                    )}
                    {attorney.eoir_admitted && (
                      <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                        🏛️ Executive Office for Immigration Review (EOIR)
                      </span>
                    )}
                    {attorney.us_tax_court && (
                      <span className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                        🏛️ United States Tax Court
                      </span>
                    )}
                    {attorney.federal_courts_json?.map((court, i) => (
                      <span key={i} className="bg-slate-50 border border-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                        🏛️ {court}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* YouTube Video Section */}
          {attorney.youtube_videos_json && attorney.youtube_videos_json.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <h3 className="text-base font-extrabold text-slate-800 mb-4 border-b border-slate-50 pb-2">
                📺 Profile Video & Consult Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {attorney.youtube_videos_json.map((video, idx) => {
                  const embedUrl = getYoutubeEmbedUrl(video.url);
                  if (!embedUrl) return null;
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100">
                        <iframe
                          width="100%"
                          height="100%"
                          src={embedUrl}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <span className="text-xs font-bold text-slate-700">{video.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Consultation Sidebar */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          
          {/* Shimmer Legal Insurance Badges */}
          {attorney.accepts_legal_plans && attorney.legal_plans_json && attorney.legal_plans_json.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-extrabold text-sm text-slate-800 tracking-tight uppercase">
                🛡️ Accepted Employer Legal Plans
              </h3>
              
              <div className="flex flex-col gap-2.5">
                {attorney.legal_plans_json.map((plan, idx) => {
                  let shimmerClass = "shimmer-gold";
                  if (plan.plan_name?.includes("ARAG")) shimmerClass = "shimmer-blue";
                  if (plan.plan_name?.includes("Shield")) shimmerClass = "shimmer-green";

                  return (
                    <div 
                      key={idx} 
                      className={`text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-sm relative overflow-hidden font-bold ${shimmerClass}`}
                    >
                      <div className="flex flex-col z-10">
                        <span className="text-xs tracking-wide">{plan.plan_name}</span>
                        <span className="text-[10px] text-white/80 font-medium">Provider Network</span>
                      </div>
                      <span className="text-xs bg-white/20 border border-white/30 px-2 py-0.5 rounded-full z-10">
                        {plan.verified ? "✓ Verified" : "Verification Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {attorney.legal_plans_note && (
                <p className="text-[10px] text-slate-400 italic font-bold">
                  Note: {attorney.legal_plans_note}
                </p>
              )}
            </div>
          )}

          {/* Consultation Fee Details */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 font-semibold text-slate-700">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight uppercase">
              💵 Fee Structure & Rates
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span>Consultation Fee:</span>
                <span className="font-bold text-slate-900">
                  {attorney.consultation_fee_amount === "0.00" || !attorney.consultation_fee_amount ? "FREE" : `$${attorney.consultation_fee_amount}`}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span>Duration:</span>
                <span className="font-bold text-slate-900">
                  {attorney.consultation_duration === "30_min" ? "30 Minutes" : attorney.consultation_duration === "15_min" ? "15 Minutes" : "60 Minutes"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span>Billing Models:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {attorney.billing_model_json?.map(m => m.replace('_', ' ')).join(', ') || 'Hourly'}
                </span>
              </div>
            </div>

            {attorney.flat_fees_json && attorney.flat_fees_json.length > 0 && (
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Flat Fee Services</h4>
                <div className="flex flex-col gap-1 text-xs">
                  {attorney.flat_fees_json.map((flat, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600 font-medium">
                      <span>{flat.service_name}</span>
                      <span className="font-bold text-slate-800">${flat.fee_amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact and address sidebar */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 font-semibold text-slate-700">
            <h3 className="font-extrabold text-sm text-slate-800 tracking-tight uppercase">
              📍 Office details
            </h3>

            <div className="text-xs flex flex-col gap-3">
              <div>
                <span className="font-extrabold text-slate-400 block mb-1">Office Address</span>
                <p className="text-slate-800 font-bold">
                  🏢 {attorney.office_address_street}<br />
                  {attorney.office_address_city}, {attorney.office_address_state} {attorney.office_address_zip}
                </p>
              </div>

              {attorney.multiple_offices_json && attorney.multiple_offices_json.length > 0 && (
                <div>
                  <span className="font-extrabold text-slate-400 block mb-1">Additional Offices</span>
                  <div className="flex flex-col gap-2">
                    {attorney.multiple_offices_json.map((off, idx) => (
                      <p key={idx} className="text-slate-600 font-medium border-l-2 border-slate-100 pl-2">
                        📍 {off.street}, {off.city}, {off.state} {off.zip}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
                <div>
                  <span className="font-extrabold text-slate-400 block mb-0.5">Consultation Format</span>
                  <span className="text-slate-800">{attorney.consultation_types_json?.join(', ') || 'Phone, Video'}</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-400 block mb-0.5">Languages Spoken</span>
                  <span className="text-slate-800">
                    {attorney.languages_json?.map(l => `${l.language} (${l.proficiency})`).join(', ') || 'English'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
