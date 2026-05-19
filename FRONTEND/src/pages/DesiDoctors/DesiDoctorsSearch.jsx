import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { 
  CircularProgress, 
  Slider, 
  TextField, 
  InputAdornment, 
  Autocomplete,
  Tooltip
} from "@mui/material";

const SPECIALTIES = [
  "All Specialties",
  "Family Practice",
  "Internal Medicine",
  "Pediatrics",
  "Cardiology",
  "Obstetrics & Gynecology",
  "Psychiatry",
  "Gastroenterology",
  "Dermatology"
];

const INDIAN_HEALTH_SPECIALISATIONS = [
  "South Asian Diabetes Management",
  "Vegetarian Nutrition Planning",
  "Festival Fasting & Medication Timing",
  "Ayurvedic Integration",
  "Mental Health Destigmatisation",
  "Hereditary Conditions (South Asian)",
  "NRI Preventive Screening",
  "Visiting Parents Care",
  "India Medical Document Translation"
];

export default function DesiDoctorsSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [zip, setZip] = useState("");
  const [zipOptions, setZipOptions] = useState([]);
  const [zipInput, setZipInput] = useState("");
  const [radius, setRadius] = useState(100);
  const [specialty, setSpecialty] = useState("All Specialties");
  const [selectedIndianHealth, setSelectedIndianHealth] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimeout = useRef(null);

  // Fetch location autocompletes
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

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        q: searchTerm,
        zip: zip,
        radius: radius,
        specialty: specialty === "All Specialties" ? "" : specialty,
        indian_health: selectedIndianHealth || ""
      };
      const res = await api.get("/api/doctors", { params });
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch Desi Doctors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm, zip, radius, specialty, selectedIndianHealth]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Elegant Hero Search Panel */}
      <div className="bg-gradient-to-br from-[#0c4a6e] via-[#0284c7] to-[#0369a1] py-12 px-[7%] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🩺</span>
            <span className="bg-orange-500/20 text-orange-200 border border-orange-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Desipath Health Directory
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight font-dmsans">
            Find Top Desi Doctors & Group Practices
          </h1>
          <p className="text-sky-100/90 mb-8 max-w-xl text-base font-light">
            Search certified South Asian physicians specializing in South Asian diabetes, vegetarian nutrition, festival fasting adjustment, and parent care proxy services.
          </p>

          {/* Search Inputs Console */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-3 rounded-2xl lg:rounded-full shadow-xl items-center text-gray-800">
            {/* Name/Keywords Search */}
            <div className="lg:col-span-4 relative px-2">
              <TextField
                fullWidth
                placeholder="Doctor name, keyword, practice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="text-lg text-sky-500 ml-1">🔍</span>
                    </InputAdornment>
                  ),
                  className: "py-2 px-3 text-gray-800 font-medium"
                }}
              />
            </div>

            {/* Specialty Selection */}
            <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-100 px-4">
              <div className="flex items-center gap-2">
                <span className="text-lg text-sky-500">🎓</span>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-transparent py-2 text-gray-700 font-medium outline-none border-none cursor-pointer"
                >
                  {SPECIALTIES.map((spec) => (
                    <option key={spec} value={spec} className="text-gray-800 font-medium">
                      {spec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Zipcode Selection */}
            <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-gray-100 px-4">
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
                          <span className="text-lg text-sky-500">📍</span>
                        </InputAdornment>
                      ),
                      className: "py-2 px-1 text-gray-800 font-medium"
                    }}
                  />
                )}
              />
            </div>

            {/* Radius Slider */}
            <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-gray-100 px-4 py-2 lg:py-0">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                  Radius: {radius} miles
                </span>
                <Slider
                  value={radius}
                  onChange={(e, val) => setRadius(val)}
                  min={5}
                  max={250}
                  size="small"
                  sx={{ color: '#0284c7' }}
                />
              </div>
            </div>
          </div>

          {/* Indian Health Specialisation Pills */}
          <div className="mt-8 flex flex-col gap-2">
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">
              Filter by South Asian Specialties:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedIndianHealth("")}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  selectedIndianHealth === ""
                    ? "bg-white text-sky-800 border-white shadow-sm"
                    : "bg-sky-900/40 text-sky-100 border-sky-700/50 hover:bg-sky-800/40"
                }`}
              >
                ✨ Show All
              </button>
              {INDIAN_HEALTH_SPECIALISATIONS.map((ih) => (
                <button
                  key={ih}
                  onClick={() => setSelectedIndianHealth(ih)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    selectedIndianHealth === ih
                      ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                      : "bg-sky-900/40 text-sky-100 border-sky-700/50 hover:bg-sky-800/40"
                  }`}
                >
                  {ih}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Workspace */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-[7%] py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 font-dmsans">
            {loading ? "Searching..." : `Showing ${results.length} Desi Doctors`}
          </h2>
          <Link
            to="/postad"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>➕</span> List Your Medical Practice
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <CircularProgress size={50} sx={{ color: '#0284c7' }} />
            <p className="mt-4 text-slate-500 font-medium animate-pulse">
              Finding the best healthcare providers near you...
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((doctor) => {
              const imageSrc = doctor.profile_photo_url || 
                (doctor.gender === 'female' ? '/img/placeholder_female_doc.png' : '/img/placeholder_male_doc.png');
              return (
                <div 
                  key={doctor.doctor_id} 
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
                >
                  <div className="p-6 flex-grow flex flex-col">
                    {/* Header info */}
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-sky-50 flex-shrink-0 border border-slate-100">
                        <img 
                          src={imageSrc} 
                          alt={`${doctor.first_name} ${doctor.last_name}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.first_name + ' ' + doctor.last_name)}&background=e0f2fe&color=0284c7&bold=true`;
                          }}
                        />
                      </div>
                      {/* Name, credentials & verified badge */}
                      <div className="flex-grow">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors text-base font-dmsans">
                            Dr. {doctor.first_name} {doctor.last_name}, {doctor.credential || 'MD'}
                          </h3>
                          {doctor.npi_verified && (
                            <Tooltip title="NPI Verified Board Practitioner">
                              <span className="text-emerald-500 text-sm select-none">✅</span>
                            </Tooltip>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">
                          {doctor.primary_specialty}
                        </p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          <span className="text-slate-700 text-xs font-bold">{doctor.avg_rating || '5.00'}</span>
                          <span className="text-slate-400 text-xs">({doctor.review_count || 12} reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Headline or Practice name */}
                    <p className="text-slate-600 text-sm mt-4 font-normal line-clamp-2 leading-relaxed">
                      {doctor.headline || `Practicing at ${doctor.practice_name || 'Solo Practice'} in ${doctor.primary_address_city}, ${doctor.primary_address_state}`}
                    </p>

                    {/* Address details */}
                    <div className="mt-4 flex items-start gap-1.5 text-slate-500 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span>📍</span>
                      <p className="line-clamp-2">
                        {doctor.primary_address_street}, {doctor.primary_address_city}, {doctor.primary_address_state} {doctor.primary_address_zip}
                      </p>
                    </div>

                    {/* Quick Indicators / Tags */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {doctor.accepting_new_patients && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          Accepting Patients
                        </span>
                      )}
                      {doctor.telehealth_available && (
                        <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          💻 Telehealth
                        </span>
                      )}
                      {doctor.visiting_parents_care && (
                        <span className="bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          👴 Parent Visa Friendly
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-50 p-4 bg-slate-50/50 flex justify-between items-center">
                    <span className="text-slate-400 text-xs font-bold">
                      🗣️ {doctor.languages_json ? doctor.languages_json.map(l => l.language).slice(0, 2).join(', ') : 'English'}
                    </span>
                    <Link
                      to={`/doctors/${doctor.slug}`}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm hover:shadow transition-all"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-200/60 max-w-3xl mx-auto">
            <div className="text-6xl mb-4">🩺</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No Desi Doctors Found</h2>
            <p className="text-slate-500 max-w-md mx-auto text-sm px-6">
              No medical listings found matching your current filter choices. Try broadening your zipcode radius, choosing "All Specialties", or clearing the Indian Health specialisation pills.
            </p>
          </div>
        )}
      </div>

      <Footer newsletter={"block"} />
    </div>
  );
}
