import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { getFullImageUrl } from "../../utils/imageHelper";
import { 
  CircularProgress, 
  Slider, 
  TextField, 
  InputAdornment, 
  Autocomplete,
  Tooltip
} from "@mui/material";

const PRACTICE_AREAS = [
  "All Practice Areas",
  "Immigration Law",
  "Family Law & Divorce",
  "Corporate & Business Law",
  "Estate Planning & Wills",
  "Real Estate Law",
  "Intellectual Property (IP)",
  "Criminal Defense",
  "Personal Injury",
  "Tax Law",
  "Employment & Labor Law",
  "Bankruptcy Law",
  "Civil Litigation"
];

const LANGUAGES = [
  "Hindi", "Punjabi", "Gujarati", "Tamil", "Telugu", "Bengali", "Malayalam", "Kannada", "Urdu", "Marathi"
];

const BILLING_MODELS = [
  { value: "hourly", label: "Hourly Rate" },
  { value: "flat_fee", label: "Flat Fee" },
  { value: "contingency", label: "Contingency" },
  { value: "retainer", label: "Retainer" },
  { value: "pro_bono", label: "Pro Bono" }
];

const LEGAL_PLANS = [
  "MetLife Legal Plans",
  "ARAG Legal Insurance",
  "LegalShield"
];

export default function DesiAttorneysSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [zip, setZip] = useState("");
  const [zipOptions, setZipOptions] = useState([]);
  const [zipInput, setZipInput] = useState("");
  const [radius, setRadius] = useState(100);
  const [practiceArea, setPracticeArea] = useState("All Practice Areas");
  
  // Advanced Filters
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [federalCourt, setFederalCourt] = useState(false);
  const [eoirAdmitted, setEoirAdmitted] = useState(false);
  const [usTaxCourt, setUsTaxCourt] = useState(false);
  const [indiaBci, setIndiaBci] = useState(false);
  const [freeConsultation, setFreeConsultation] = useState(false);
  const [billingModel, setBillingModel] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [hasPublications, setHasPublications] = useState(false);
  const [acceptsLegalPlans, setAcceptsLegalPlans] = useState(false);
  const [legalPlan, setLegalPlan] = useState("");
  const [sabaMember, setSabaMember] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Fetch locations for autocomplete
  useEffect(() => {
    if (zipInput.length < 2) {
      setZipOptions([]);
      return;
    }
    const fetchLocations = async () => {
      try {
        const res = await api.get(`/api/location/locations?filter=${zipInput}`);
        setZipOptions(res.data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
    };
    const timer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(timer);
  }, [zipInput]);

  const fetchAttorneys = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchTerm,
        zip: zip,
        radius: radius,
        practice_area: practiceArea === "All Practice Areas" ? "" : practiceArea,
        language: selectedLanguage,
        federal_court: federalCourt ? 1 : "",
        eoir_admitted: eoirAdmitted ? 1 : "",
        us_tax_court: usTaxCourt ? 1 : "",
        india_bci: indiaBci ? 1 : "",
        free_consultation: freeConsultation ? 1 : "",
        billing_model: billingModel,
        has_video: hasVideo ? 1 : "",
        has_publications: hasPublications ? 1 : "",
        accepts_legal_plans: acceptsLegalPlans ? 1 : "",
        legal_plan: legalPlan,
        saba_member: sabaMember ? 1 : ""
      };
      const res = await api.get("/api/attorneys", { params });
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch Desi Attorneys", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(fetchAttorneys, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [
    searchTerm, zip, radius, practiceArea, selectedLanguage, federalCourt, 
    eoirAdmitted, usTaxCourt, indiaBci, freeConsultation, billingModel, 
    hasVideo, hasPublications, acceptsLegalPlans, legalPlan, sabaMember
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setZip("");
    setPracticeArea("All Practice Areas");
    setSelectedLanguage("");
    setFederalCourt(false);
    setEoirAdmitted(false);
    setUsTaxCourt(false);
    setIndiaBci(false);
    setFreeConsultation(false);
    setBillingModel("");
    setHasVideo(false);
    setHasPublications(false);
    setAcceptsLegalPlans(false);
    setLegalPlan("");
    setSabaMember(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="bg-slate-100 border-b border-slate-200/60 py-3 px-[7%] text-xs text-slate-500 font-medium">
        <div className="max-w-6xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-semibold">Attorneys</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#475569] py-5 px-[7%] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-2xl">⚖️</span>
            <span className="bg-amber-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Desipath Law Directory
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <h1 className="text-lg md:text-xl font-bold tracking-tight font-dmsans text-amber-100">
              Find Top Desi Attorneys & Legal Counsel
            </h1>
          </div>

          {/* Search Inputs Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-3 rounded-2xl lg:rounded-full shadow-xl items-center text-gray-800">
            {/* Search terms */}
            <div className="lg:col-span-4 relative px-2">
              <TextField
                fullWidth
                placeholder="Attorney name, school, case area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="text-lg text-amber-500 ml-1">🔍</span>
                    </InputAdornment>
                  ),
                  className: "py-2 px-3 text-gray-800 font-semibold"
                }}
              />
            </div>

            {/* Practice Area Selection */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-gray-100 px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg text-amber-500">📁</span>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value)}
                  className="w-full bg-transparent py-2 text-gray-700 font-bold outline-none border-none cursor-pointer"
                >
                  {PRACTICE_AREAS.map((pa) => (
                    <option key={pa} value={pa} className="text-gray-800 font-semibold">
                      {pa}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zipcode Selection */}
            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-gray-100 px-4">
              <Autocomplete
                fullWidth
                options={zipOptions}
                getOptionLabel={(option) => `${option.city}, ${option.state_id} ${option.zip}`}
                filterOptions={(x) => x}
                value={zipOptions.find(o => o.zip === zip) || (zip ? { zip, city: '', state_id: '' } : null)}
                onChange={(e, newVal) => {
                  if (newVal) setZip(newVal.zip);
                  else setZip("");
                }}
                onInputChange={(e, newInputValue) => setZipInput(newInputValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="City, State or Zip"
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <span className="text-lg text-amber-500 mr-2">📍</span>
                        </InputAdornment>
                      ),
                      className: "py-2 px-1 text-gray-800 font-semibold"
                    }}
                  />
                )}
              />
            </div>
          </div>

          {/* Radius Selector */}
          {zip && (
            <div className="mt-6 flex items-center gap-4 bg-black/20 backdrop-blur-md px-6 py-2.5 rounded-full w-fit">
              <span className="text-xs font-bold text-slate-200">Search Radius:</span>
              <div className="w-48">
                <Slider
                  value={radius}
                  min={5}
                  max={250}
                  step={5}
                  onChange={(e, val) => setRadius(val)}
                  sx={{ color: '#f59e0b' }}
                />
              </div>
              <span className="text-xs font-extrabold text-amber-300 font-mono">{radius} Miles</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="max-w-6xl mx-auto w-full px-[7%] py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Left Filter Sidebar */}
        <div className="lg:w-1/4 flex flex-col gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Refine Directory</h3>
            <button onClick={clearFilters} className="text-xs text-amber-600 hover:text-amber-700 font-bold">
              Clear All
            </button>
          </div>

          {/* Languages spoken */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Languages Spoken</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer outline-none focus:border-amber-500"
            >
              <option value="">Any Language</option>
              {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
            </select>
          </div>

          {/* Billing models */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Model</label>
            <select
              value={billingModel}
              onChange={(e) => setBillingModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer outline-none focus:border-amber-500"
            >
              <option value="">Any Billing Model</option>
              {BILLING_MODELS.map(bm => <option key={bm.value} value={bm.value}>{bm.label}</option>)}
            </select>
          </div>

          {/* Legal Plans */}
          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={acceptsLegalPlans} 
                onChange={(e) => {
                  setAcceptsLegalPlans(e.target.checked);
                  if (!e.target.checked) setLegalPlan("");
                }} 
                className="accent-amber-500" 
              />
              <span className="text-xs font-bold text-slate-700">Accepts Legal Insurance</span>
            </label>
            
            {acceptsLegalPlans && (
              <select
                value={legalPlan}
                onChange={(e) => setLegalPlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold cursor-pointer outline-none focus:border-amber-500 mt-1"
              >
                <option value="">Any Network</option>
                {LEGAL_PLANS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
              </select>
            )}
          </div>

          {/* Admission Checks */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admissions & Credentials</label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={federalCourt} onChange={e => setFederalCourt(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">Federal Court Admitted</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={eoirAdmitted} onChange={e => setEoirAdmitted(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">EOIR (Immigration Court)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={usTaxCourt} onChange={e => setUsTaxCourt(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">US Tax Court</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={indiaBci} onChange={e => setIndiaBci(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">Bar Council of India</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={sabaMember} onChange={e => setSabaMember(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">SABA Member</span>
            </label>
          </div>

          {/* Additional features */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Features</label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={freeConsultation} onChange={e => setFreeConsultation(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">Free Initial Consultation</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={hasVideo} onChange={e => setHasVideo(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">Includes Profile Video</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={hasPublications} onChange={e => setHasPublications(e.target.checked)} className="accent-amber-500" />
              <span className="text-xs font-bold text-slate-700">Has Publications</span>
            </label>
          </div>
        </div>

        {/* Right Listings Grid */}
        <div className="lg:w-3/4 flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <CircularProgress size={50} sx={{ color: '#b45309' }} />
              <p className="mt-4 text-slate-500 font-medium">Finding matching attorneys...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Showing {results.length} results matching your criteria
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.map((attorney) => {
                  const imageSrc = attorney.profile_photo_url ? getFullImageUrl(attorney.profile_photo_url) : 
                    (attorney.gender === 'female' ? '/img/placeholder_female_doc.png' : '/img/placeholder_male_doc.png');
                  
                  return (
                    <div key={attorney.attorney_id} className="bg-white rounded-3xl border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between text-gray-800">
                      <div>
                        {/* Hero Header Card */}
                        <div className="flex gap-4 items-start mb-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                            <img 
                              src={imageSrc} 
                              alt={`${attorney.first_name} ${attorney.last_name}`} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(attorney.first_name + ' ' + attorney.last_name)}&background=fef3c7&color=b45309&bold=true`;
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                Verified Attorney
                              </span>
                              {attorney.profile_completeness >= 80 && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                  Complete profile
                                </span>
                              )}
                            </div>
                            <h3 className="font-extrabold text-base text-slate-800 hover:text-amber-700 transition-colors">
                              <Link to={`/attorneys/${attorney.slug}`}>
                                {attorney.first_name} {attorney.last_name}
                              </Link>
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                              🎓 {attorney.law_school || 'Law Faculty'}
                            </p>
                          </div>
                        </div>

                        {/* Bio summary */}
                        <p className="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed font-medium">
                          {attorney.short_bio}
                        </p>

                        {/* Badges/Highlights */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {attorney.practice_areas_json && attorney.practice_areas_json.slice(0, 3).map((pa, i) => (
                            <span key={i} className="bg-slate-50 border border-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                              {pa}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                        <div className="text-[10px] font-bold text-slate-400">
                          📍 {attorney.office_address_city || 'City'}, {attorney.office_address_state || 'NJ'}
                        </div>
                        <Link 
                          to={`/attorneys/${attorney.slug}`} 
                          className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition-all shadow-sm shadow-amber-100"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-lg font-bold text-slate-700">No Attorneys Found</h3>
              <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto font-medium">
                Try adjusting your search filters or broadening your zipcode radius to find suitable legal counsel.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
