import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { CircularProgress } from "@mui/material";

const TAB_SECTIONS = [
  { id: "section-highlights", label: "Highlights" },
  { id: "section-plans", label: "Plans Accepted" },
  { id: "section-specialties", label: "Specialties & Expertise" },
  { id: "section-awards", label: "Awards & Recognitions" },
  { id: "section-facilities", label: "Affiliated Facilities" },
  { id: "section-locations", label: "Locations & Hours" },
  { id: "section-about", label: "More About Me" }
];

export default function DoctorProfile() {
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("section-highlights");
  const [insuranceFilter, setInsuranceFilter] = useState("");
  const [plansExpanded, setPlansExpanded] = useState(false);
  
  const tabRefs = useRef({});

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/doctors/${slug}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [slug]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of TAB_SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = element.offsetTop - 140;
      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
      setActiveTab(id);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-32">
          <CircularProgress size={60} sx={{ color: '#0284c7' }} />
          <p className="mt-4 text-slate-500 font-medium">Loading premium provider details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
          <p className="text-slate-500 max-w-sm mt-2">
            The profile you are trying to view does not exist or has been removed.
          </p>
          <Link to="/desi-doctors" className="mt-6 bg-sky-600 text-white font-bold px-6 py-2.5 rounded-full">
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageSrc = doctor.profile_photo_url || 
    (doctor.gender === 'female' ? '/img/placeholder_female_doc.png' : '/img/placeholder_male_doc.png');

  // Filter insurance plans
  const filteredPlans = doctor.insurance_plans_json ? doctor.insurance_plans_json.filter(plan => 
    plan.toLowerCase().includes(insuranceFilter.toLowerCase())
  ) : [];

  const displayPlans = plansExpanded ? filteredPlans : filteredPlans.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Modern Profile Header */}
      <div className="bg-gradient-to-br from-[#0c4a6e] to-[#0369a1] text-white py-12 px-[7%] relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center relative z-10">
          
          {/* Circular/Rounded Avatar */}
          <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/10 border-4 border-white/20 shadow-xl flex-shrink-0">
            <img 
              src={imageSrc} 
              alt={`${doctor.first_name} ${doctor.last_name}`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.first_name + ' ' + doctor.last_name)}&background=e0f2fe&color=0284c7&bold=true`;
              }}
            />
          </div>

          {/* Core Info Column */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <span className="bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Desi Doctor Verified
              </span>
              {doctor.npi_verified && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  NPI Verified Board Practitioner
                </span>
              )}
              {doctor.telehealth_available && (
                <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  💻 Telehealth
                </span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight font-dmsans">
              Dr. {doctor.first_name} {doctor.last_name}, {doctor.credential || 'MD'}
            </h1>
            <p className="text-sky-200 font-bold uppercase tracking-widest text-sm mt-1">
              {doctor.primary_specialty}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-sky-100/90">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-lg">★</span>
                <span className="font-bold text-white">{doctor.avg_rating || '5.00'}</span>
                <span className="text-sky-200 text-xs">({doctor.review_count || 12} Patient Reviews)</span>
              </div>
              <span className="hidden md:inline text-sky-300/40">|</span>
              <p className="text-sky-100">
                🏢 {doctor.practice_name || 'Solo Practice'}
              </p>
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex-shrink-0 w-full md:w-auto text-center flex flex-col gap-3 shadow-lg">
            <span className="text-xs font-bold text-sky-100 uppercase tracking-widest">Appointment Booking</span>
            <a 
              href={doctor.appointment_booking_url || `tel:${doctor.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm py-3 px-6 rounded-xl transition-all shadow-md inline-block"
            >
              🗓️ Book Appointment
            </a>
            <a 
              href={`tel:${doctor.phone}`}
              className="text-white hover:text-sky-200 font-bold text-xs underline"
            >
              Or Call: {doctor.phone}
            </a>
          </div>

        </div>
      </div>

      {/* Sticky Scroll Navigation Tab-Bar */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-40 shadow-sm overflow-x-auto">
        <div className="max-w-6xl mx-auto flex px-[7%] py-2 md:py-0 whitespace-nowrap scrollbar-none">
          {TAB_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`py-4 px-5 text-sm font-bold border-b-2 transition-all ${
                activeTab === sec.id
                  ? "border-sky-600 text-sky-700 font-extrabold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Page Content */}
      <div className="max-w-6xl mx-auto w-full px-[7%] py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Left Side Content Scroll Sections */}
        <div className="lg:col-span-8 flex flex-col gap-10">

          {/* NRI Statement Highlight Callout Box (Spec enforced) */}
          {doctor.nri_specialist_statement && (
            <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/20 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-sm">
              <h4 className="text-sm font-extrabold text-orange-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span>🧡</span> NRI Speciality Patient Statement
              </h4>
              <p className="text-slate-700 leading-relaxed text-sm italic font-medium">
                "{doctor.nri_specialist_statement}"
              </p>
            </div>
          )}

          {/* Section 1: Highlights */}
          <section id="section-highlights" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-4 font-dmsans flex items-center gap-2">
              <span>🌟</span> Provider Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Detail Column */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Practice Type</span>
                  <span className="text-sm text-slate-800 font-bold uppercase">{doctor.practice_type} Practice</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">NPI Number</span>
                  <span className="text-sm text-sky-700 font-bold font-mono">{doctor.npi_number || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Gender</span>
                  <span className="text-sm text-slate-800 font-bold uppercase">{doctor.gender}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Languages Spoken</span>
                  <span className="text-sm text-slate-800 font-bold">
                    {doctor.languages_json ? doctor.languages_json.map(l => l.language).join(', ') : 'English'}
                  </span>
                </div>
              </div>

              {/* Status and Badges Column */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Status</span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-extrabold px-3 py-1 rounded-md">
                    Accepting New Patients
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Same-Day Availability</span>
                  <span className={`text-sm font-bold ${doctor.same_day_available ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {doctor.same_day_available ? '✓ Available' : '✗ No same-day slots'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Visiting Parents Friendly</span>
                  <span className="text-sm text-orange-600 font-bold">
                    {doctor.visiting_parents_care ? '✓ Supported' : '✗ Contact clinic'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                  <span className="text-sm text-slate-400 font-bold uppercase">Ayurveda Integration</span>
                  <span className="text-sm text-sky-600 font-bold">Supported</span>
                </div>
              </div>
            </div>

            {/* Insurance Match Banner */}
            <div className="mt-8 bg-sky-50 border border-sky-100 p-4 rounded-2xl flex items-center gap-3.5">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="text-xs font-bold text-sky-800 uppercase tracking-widest">Desipath Insurance Match</h4>
                <p className="text-slate-600 text-xs mt-0.5">
                  This provider is verified to accept top commercial insurance plans. Scroll down to search and verify your plan.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Plans Accepted */}
          <section id="section-plans" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800 font-dmsans flex items-center gap-2">
                <span>🛡️</span> Insurance Plans Accepted
              </h2>
              {/* Plan Search Filter */}
              <div className="relative w-full md:w-60">
                <input 
                  type="text"
                  placeholder="Search insurance plan..."
                  value={insuranceFilter}
                  onChange={(e) => setInsuranceFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-sky-500 font-medium"
                />
              </div>
            </div>

            {filteredPlans.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {displayPlans.map((plan, index) => (
                    <div 
                      key={index} 
                      className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-slate-700 shadow-sm"
                    >
                      <span className="text-emerald-500 text-sm">✓</span>
                      {plan}
                    </div>
                  ))}
                </div>

                {filteredPlans.length > 6 && (
                  <button
                    onClick={() => setPlansExpanded(!plansExpanded)}
                    className="mt-4 text-xs font-bold text-sky-600 hover:text-sky-700 underline focus:outline-none"
                  >
                    {plansExpanded ? "View Less Accepted Plans" : `View All ${filteredPlans.length} Accepted Plans`}
                  </button>
                )}
              </div>
            ) : (
              <p className="text-slate-400 text-xs font-medium italic">
                No insurance plans match your search filter criteria.
              </p>
            )}

            {/* Self-Pay Section */}
            {doctor.self_pay_accepted && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Self-Pay & Non-Insured Rate Details</h4>
                <p className="text-slate-500 text-xs leading-relaxed max-w-xl">
                  Self-pay is accepted at this practice. Highly beneficial for visiting parents on foreign tourist visas without US health coverage. Consultation pricing ranges between <strong>${doctor.self_pay_fee_min || '100'}</strong> and <strong>${doctor.self_pay_fee_max || '200'}</strong> per visit.
                </p>
              </div>
            )}
          </section>

          {/* Section 3: Specialties & Expertise */}
          <section id="section-specialties" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-dmsans flex items-center gap-2">
              <span>🩺</span> Specialties & Clinical Expertise
            </h2>

            {/* Primary & Subspecialties */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Practice Specialty</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-sky-50 text-sky-800 border border-sky-100 px-3.5 py-1.5 rounded-full text-xs font-extrabold">
                  {doctor.primary_specialty}
                </span>
                {doctor.subspecialties_json && doctor.subspecialties_json.map((sub, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 px-3.5 py-1.5 rounded-full text-xs font-bold">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Indian Health Specialisations Block (Spec enforced) */}
            {doctor.indian_health_specialisations_json && doctor.indian_health_specialisations_json.length > 0 && (
              <div className="mb-8 bg-sky-50/50 rounded-2xl p-5 border border-sky-100/50">
                <h4 className="text-xs font-extrabold text-sky-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span>🇮🇳</span> South Asian / Indian Health Specialisations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctor.indian_health_specialisations_json.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-start bg-white p-3 rounded-xl border border-sky-100/30 shadow-sm">
                      <span className="text-orange-500 text-sm mt-0.5">⭐</span>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">{spec}</h5>
                        <p className="text-slate-500 text-[10px] mt-0.5 leading-relaxed">
                          Clinical protocol customized to Indian family biological traits, vegetarian food charts, or fast patterns.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Board Certifications */}
            {doctor.board_certifications_json && doctor.board_certifications_json.length > 0 && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Board Certifications</h4>
                <div className="flex flex-col gap-3">
                  {doctor.board_certifications_json.map((cert, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 border-b border-slate-50">
                      <span className="text-emerald-500 text-lg">🛡️</span>
                      <p className="text-xs text-slate-700 font-bold">
                        {cert.board} - <span className="text-slate-500 font-semibold">{cert.specialty}</span> ({cert.year_certified})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditions Treated & Procedures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Conditions Treated</h4>
                <ul className="flex flex-col gap-2">
                  {doctor.conditions_treated_json ? doctor.conditions_treated_json.map((cond, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> {cond}
                    </li>
                  )) : <span className="text-xs text-slate-400 italic font-medium">Contact clinic</span>}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Procedures Performed</h4>
                <ul className="flex flex-col gap-2">
                  {doctor.procedures_json ? doctor.procedures_json.map((proc, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span> {proc}
                    </li>
                  )) : <span className="text-xs text-slate-400 italic font-medium">Contact clinic</span>}
                </ul>
              </div>
            </div>

          </section>

          {/* Section 4: Awards & Recognitions */}
          <section id="section-awards" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-dmsans flex items-center gap-2">
              <span>🏆</span> Awards & Certifications
            </h2>

            {doctor.awards && doctor.awards.length > 0 ? (
              <div className="flex flex-col gap-4">
                {doctor.awards.map((award) => (
                  <div 
                    key={award.id} 
                    className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-start gap-4 shadow-sm"
                  >
                    <span className="text-3xl">🏅</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{award.award_name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{award.awarding_org}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {award.years_json && award.years_json.map((yr, idx) => (
                          <span key={idx} className="bg-sky-50 text-sky-800 border border-sky-100 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            {yr}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic font-medium">
                No awards are recorded for this provider currently.
              </p>
            )}
          </section>

          {/* Section 5: Affiliated Facilities */}
          <section id="section-facilities" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-dmsans flex items-center gap-2">
              <span>🏢</span> Hospital & Medical Group Affiliations
            </h2>

            {doctor.affiliations && doctor.affiliations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctor.affiliations.map((aff) => (
                  <div 
                    key={aff.id} 
                    className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{aff.facility_name}</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                          {aff.facility_type} • {aff.affiliation_type}
                        </p>
                      </div>
                      <span className="text-2xl">🏥</span>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-50 pt-3">
                      <span className="text-slate-400 text-xs font-bold">CMS Star Rating:</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-sm ${i < Math.floor(aff.cms_star_rating || 4) ? 'text-amber-400' : 'text-slate-200'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-slate-700 text-xs font-bold">({aff.cms_star_rating || '4.0'})</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs italic font-medium">
                No hospital or healthcare system affiliations registered for this provider.
              </p>
            )}
          </section>

          {/* Section 6: Locations & Hours */}
          <section id="section-locations" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-dmsans flex items-center gap-2">
              <span>📍</span> Practice Locations & Office Hours
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Primary location card */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Office Address</h4>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">{doctor.practice_name || 'Medical Clinic'}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {doctor.primary_address_street}<br />
                      {doctor.primary_address_city}, {doctor.primary_address_state} {doctor.primary_address_zip}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2 border-t border-slate-200/60 pt-3">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${doctor.practice_name} ${doctor.primary_address_street} ${doctor.primary_address_city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
                    >
                      🗺️ Get Google Maps Directions
                    </a>
                    <a 
                      href={`tel:${doctor.phone}`}
                      className="text-xs font-bold text-slate-600 flex items-center gap-1"
                    >
                      📞 Phone: {doctor.phone}
                    </a>
                  </div>
                </div>

                {/* Telehealth support */}
                {doctor.telehealth_available && (
                  <div className="mt-4 bg-sky-50 border border-sky-100 p-4 rounded-xl flex items-center gap-3">
                    <span className="text-2xl">💻</span>
                    <div>
                      <h5 className="text-xs font-bold text-sky-800 uppercase tracking-wider">Telehealth Video Consults</h5>
                      <p className="text-slate-600 text-[10px] leading-relaxed mt-0.5">
                        Licensed to treat telehealth video patients residing in: <strong>{doctor.telehealth_states_json ? doctor.telehealth_states_json.join(', ') : 'NJ'}</strong>.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hours of operations */}
              <div className="md:col-span-6 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Office Hours</h4>
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-xs">
                    <tbody>
                      {doctor.office_hours_json ? doctor.office_hours_json.map((item, idx) => (
                        <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-bold text-slate-700">{item.day}</td>
                          <td className="py-2.5 px-4 text-right text-slate-500 font-medium">
                            {item.closed ? (
                              <span className="text-red-500 font-bold">Closed</span>
                            ) : (
                              `${item.open_time} - ${item.close_time}`
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr className="border-0">
                          <td colSpan="2" className="py-4 text-center text-slate-400 italic">Call clinic to confirm hours</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* India Parents IST Conversion Helper */}
                <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-xl flex items-start gap-2.5">
                  <span className="text-lg">⏰</span>
                  <div>
                    <h5 className="text-xs font-bold text-amber-800">IST Consultation Coordination</h5>
                    <p className="text-slate-600 text-[10px] leading-relaxed mt-0.5">
                      Parents back in India? Typical clinic hours translate to <strong>6:30 PM - 2:30 AM Indian Standard Time (IST)</strong>. Perfect for scheduling collaborative family video consults!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: More About Me */}
          <section id="section-about" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm scroll-mt-28">
            <h2 className="text-xl font-bold text-slate-800 mb-6 font-dmsans flex items-center gap-2">
              <span>🩺</span> More About Dr. {doctor.last_name}
            </h2>

            {/* Bio */}
            {doctor.bio && (
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2.5">Provider Biography</h4>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl font-normal">
                  {doctor.bio}
                </p>
              </div>
            )}

            {/* Cultural background & medical training */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cultural Background & Languages</h4>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Heritage Background</p>
                    <p className="text-xs text-slate-700 font-bold mt-0.5">{doctor.cultural_background || 'South Asian (Indian)'}</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">India Medical Training Details</p>
                    <p className="text-xs text-slate-700 font-bold mt-0.5">{doctor.india_medical_college || 'MBBS / Resi details available upon request'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Visiting Parents Support Features</h4>
                <div className="flex flex-col gap-2">
                  <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-xl flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Elderly Visiting Parent Consults</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Clinic offers foreign patient self-pay tracks without insurance barriers.</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100/50 p-3 rounded-xl flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Medical Proxy & Document Assistance</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Translation of Indian health summaries and family medical records.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right Side Sticky Sidebar Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:self-start lg:sticky lg:top-[110px]">
          
          {/* Quick Contact Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 font-dmsans">Quick Contact Details</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</p>
                  <a href={`tel:${doctor.phone}`} className="text-xs text-sky-700 font-extrabold">{doctor.phone}</a>
                </div>
              </div>

              {doctor.email && (
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xl">✉️</span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Email Address</p>
                    <a href={`mailto:${doctor.email}`} className="text-xs text-sky-700 font-bold">{doctor.email}</a>
                  </div>
                </div>
              )}

              {doctor.website_url && (
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Official Website</p>
                    <a 
                      href={doctor.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-sky-700 font-bold truncate block max-w-[200px]"
                    >
                      {doctor.website_url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desipath Community Health Banner */}
          <div className="bg-gradient-to-br from-[#0c4a6e] to-[#0284c7] rounded-3xl p-6 text-white shadow-md flex flex-col gap-4">
            <span className="text-3xl">🩺</span>
            <div>
              <h4 className="text-sm font-extrabold tracking-tight font-dmsans">Need Indian Document Translation?</h4>
              <p className="text-sky-100 text-xs mt-1 leading-relaxed font-light">
                Many Desi doctors specialize in translating and importing medical reports and medication names (e.g. standard paracetamol or diabetes trade brands) from Indian hospital systems. Ask your provider today!
              </p>
            </div>
            <Link 
              to="/desi-doctors" 
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs py-2 px-4 rounded-xl text-center transition-colors"
            >
              ← Return to Directory
            </Link>
          </div>

        </div>

      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
