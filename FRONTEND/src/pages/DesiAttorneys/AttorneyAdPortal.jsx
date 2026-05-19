import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const STEPS = [
  { id: 0, label: "Basic Info & Bio", icon: "👤" },
  { id: 1, label: "Contact Details", icon: "📞" },
  { id: 2, label: "Web & Social", icon: "🌐" },
  { id: 3, label: "Education", icon: "🎓" },
  { id: 4, label: "Bar & Jurisdictions", icon: "⚖️" },
  { id: 5, label: "Practice Areas", icon: "📁" },
  { id: 6, label: "Fees & Legal Plans", icon: "💳" },
  { id: 7, label: "Languages", icon: "🗣️" },
  { id: 8, label: "Associations", icon: "🤝" },
  { id: 9, label: "Awards", icon: "🏆" },
  { id: 10, label: "Publications", icon: "📚" },
  { id: 11, label: "Review & Submit", icon: "🚀" }
];

const PRACTICE_AREAS = [
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

const STATE_OPTIONS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

const LANGUAGES = [
  "English", "Hindi", "Punjabi", "Gujarati", "Tamil", "Telugu", "Bengali", "Malayalam", "Kannada", "Urdu", "Marathi"
];

const LEGAL_PLANS = [
  { plan_name: "MetLife Legal Plans", provider: "MetLife", badge_color: "amber" },
  { plan_name: "ARAG Legal Insurance", provider: "ARAG", badge_color: "blue" },
  { plan_name: "LegalShield", provider: "LegalShield", badge_color: "green" }
];

export default function AttorneyAdPortal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [completenessScore, setCompletenessScore] = useState(0);

  // Form Fields State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "male",
    profile_photo_url: "",
    short_bio: "",
    full_biography: "",
    career_summary: "",
    nri_client_statement: "",
    personal_note: "",
    nri_specialisation: false,
    india_law_knowledge: false,

    email: "",
    phone: "",
    office_address_street: "",
    office_address_city: "",
    office_address_state: "NJ",
    office_address_zip: "",
    
    website_url: "",
    blog_url: "",
    blog_platform: "",
    blog_description: "",
    linkedin_url: "",
    twitter_url: "",
    facebook_url: "",
    instagram_url: "",

    law_school: "",
    law_degree: "JD",
    graduation_year: "",
    law_school_honours: "",
    undergraduate_institution: "",
    undergraduate_degree: "",
    undergraduate_year: "",

    us_supreme_court: false,
    eoir_admitted: false,
    us_tax_court: false,
    india_bci: false,
    india_bci_details: "",
    other_jurisdictions: "",

    accepts_legal_plans: false,
    legal_plans_note: "",
    consultation_fee_amount: "",
    consultation_duration: "30_min",
    retainer_details: "",
    fee_note: "",
  });

  // Dynamic Lists State
  const [multipleOffices, setMultipleOffices] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState(["Phone", "Video"]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [additionalDegrees, setAdditionalDegrees] = useState([]);
  const [federalCourts, setFederalCourts] = useState([]);
  const [appealsCircuits, setAppealsCircuits] = useState([]);
  const [selectedLegalPlans, setSelectedLegalPlans] = useState([]);
  const [billingModels, setBillingModels] = useState(["hourly"]);
  const [flatFees, setFlatFees] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(["Credit Card", "Check"]);
  const [languagesSpoken, setLanguagesSpoken] = useState([{ language: "English", proficiency: "Fluent" }]);
  const [associations, setAssociations] = useState([]);
  const [awards, setAwards] = useState([]);
  const [publications, setPublications] = useState([]);
  const [practiceAreas, setPracticeAreas] = useState([]);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [locationsCovered, setLocationsCovered] = useState([]);
  const [statesLicensed, setStatesLicensed] = useState([]);

  // Temp Inputs
  const [tempOffice, setTempOffice] = useState({ street: "", city: "", state: "NJ", zip: "", phone: "" });
  const [tempArticle, setTempArticle] = useState({ title: "", url: "" });
  const [tempVideo, setTempVideo] = useState({ title: "", url: "" });
  const [tempDegree, setTempDegree] = useState({ institution: "", degree: "", year: "", subject: "" });
  const [tempFlatFee, setTempFlatFee] = useState({ service_name: "", fee_amount: "" });
  const [tempLang, setTempLang] = useState({ language: "Hindi", proficiency: "Fluent" });
  const [tempAssoc, setTempAssoc] = useState({ name: "", year: "", role: "", type: "State Bar" });
  const [tempAward, setTempAward] = useState({ name: "", organisation: "", year: "", category: "" });
  const [tempPub, setTempPub] = useState({ title: "", type: "Article", publisher: "", date: "", url: "", featured: false });
  const [tempService, setTempService] = useState("");
  const [tempMetro, setTempMetro] = useState("");
  const [tempLicense, setTempLicense] = useState({ state: "NJ", year_admitted: "", bar_number: "" });

  useEffect(() => {
    if (isEdit) {
      const fetchAttorney = async () => {
        setFetching(true);
        try {
          const res = await api.get(`/api/attorneys/${id}`);
          if (res.data.success) {
            const data = res.data.data;
            
            // Populate form
            setFormData({
              first_name: data.first_name || "",
              last_name: data.last_name || "",
              gender: data.gender || "male",
              profile_photo_url: data.profile_photo_url || "",
              short_bio: data.short_bio || "",
              full_biography: data.full_biography || "",
              career_summary: data.career_summary || "",
              nri_client_statement: data.nri_client_statement || "",
              personal_note: data.personal_note || "",
              nri_specialisation: !!data.nri_specialisation,
              india_law_knowledge: !!data.india_law_knowledge,
              email: data.email || "",
              phone: data.phone || "",
              office_address_street: data.office_address_street || "",
              office_address_city: data.office_address_city || "",
              office_address_state: data.office_address_state || "NJ",
              office_address_zip: data.office_address_zip || "",
              website_url: data.website_url || "",
              blog_url: data.blog_url || "",
              blog_platform: data.blog_platform || "",
              blog_description: data.blog_description || "",
              linkedin_url: data.linkedin_url || "",
              twitter_url: data.twitter_url || "",
              facebook_url: data.facebook_url || "",
              instagram_url: data.instagram_url || "",
              law_school: data.law_school || "",
              law_degree: data.law_degree || "JD",
              graduation_year: data.graduation_year || "",
              law_school_honours: data.law_school_honours || "",
              undergraduate_institution: data.undergraduate_institution || "",
              undergraduate_degree: data.undergraduate_degree || "",
              undergraduate_year: data.undergraduate_year || "",
              us_supreme_court: !!data.us_supreme_court,
              eoir_admitted: !!data.eoir_admitted,
              us_tax_court: !!data.us_tax_court,
              india_bci: !!data.india_bci,
              india_bci_details: data.india_bci_details || "",
              other_jurisdictions: data.other_jurisdictions || "",
              accepts_legal_plans: !!data.accepts_legal_plans,
              legal_plans_note: data.legal_plans_note || "",
              consultation_fee_amount: data.consultation_fee_amount || "",
              consultation_duration: data.consultation_duration || "30_min",
              retainer_details: data.retainer_details || "",
              fee_note: data.fee_note || "",
            });

            // Populate JSON arrays
            if (data.multiple_offices_json) setMultipleOffices(data.multiple_offices_json);
            if (data.consultation_types_json) setConsultationTypes(data.consultation_types_json);
            if (data.featured_articles_json) setFeaturedArticles(data.featured_articles_json);
            if (data.youtube_videos_json) setYoutubeVideos(data.youtube_videos_json);
            if (data.additional_degrees_json) setAdditionalDegrees(data.additional_degrees_json);
            if (data.federal_courts_json) setFederalCourts(data.federal_courts_json);
            if (data.appeals_circuits_json) setAppealsCircuits(data.appeals_circuits_json);
            if (data.legal_plans_json) setSelectedLegalPlans(data.legal_plans_json);
            if (data.billing_model_json) setBillingModels(data.billing_model_json);
            if (data.flat_fees_json) setFlatFees(data.flat_fees_json);
            if (data.payment_methods_json) setPaymentMethods(data.payment_methods_json);
            if (data.languages_json) setLanguagesSpoken(data.languages_json);
            if (data.associations_json) setAssociations(data.associations_json);
            if (data.awards_json) setAwards(data.awards_json);
            if (data.publications_json) setPublications(data.publications_json);
            if (data.practice_areas_json) setPracticeAreas(data.practice_areas_json);
            if (data.services_offered_json) setServicesOffered(data.services_offered_json);
            if (data.locations_covered_json) setLocationsCovered(data.locations_covered_json);
            if (data.states_licensed_json) setStatesLicensed(data.states_licensed_json);
          }
        } catch (err) {
          toast.error("Failed to fetch attorney listing details");
        } finally {
          setFetching(false);
        }
      };
      fetchAttorney();
    }
  }, [id, isEdit]);

  // Recalculate Completeness Score Preview
  useEffect(() => {
    let score = 0;
    if (formData.short_bio) score += 10;
    if (formData.full_biography && formData.full_biography.split(/\s+/).filter(Boolean).length >= 100) score += 10;
    if (formData.nri_client_statement) score += 5;
    if (formData.career_summary || formData.personal_note) score += 5;
    if (formData.email && (formData.phone || formData.office_address_street)) score += 10;
    if (statesLicensed.length > 0) score += 15;
    if (federalCourts.length > 0 || formData.us_supreme_court || formData.eoir_admitted || formData.us_tax_court) score += 5;
    if (practiceAreas.length >= 3) score += 10;
    if (billingModels.length > 0) score += 8;
    if (selectedLegalPlans.length > 0 && formData.accepts_legal_plans) score += 2;
    if (languagesSpoken.length > 0) score += 5;
    if (formData.law_school && formData.law_degree) score += 10;
    if (associations.length > 0) score += 5;
    
    let socialCount = 0;
    if (formData.linkedin_url) socialCount++;
    if (formData.twitter_url) socialCount++;
    if (formData.facebook_url) socialCount++;
    if (formData.instagram_url) socialCount++;
    if (socialCount >= 2) score += 3;

    if (publications.length > 0 || formData.blog_url) score += 4;
    if (youtubeVideos.length > 0) score += 3;

    setCompletenessScore(Math.min(100, score));
  }, [formData, statesLicensed, federalCourts, practiceAreas, billingModels, selectedLegalPlans, languagesSpoken, associations, publications, youtubeVideos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = () => {
    // Basic step validation
    if (currentStep === 0) {
      if (!formData.first_name || !formData.last_name || !formData.short_bio || !formData.full_biography) {
        toast.warning("Please fill in all required fields (First name, Last name, Short bio, Full biography).");
        return;
      }
      if (formData.short_bio.length > 300) {
        toast.warning("Short bio must be under 300 characters.");
        return;
      }
      const wordCount = formData.full_biography.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 100) {
        toast.warning(`Full biography must be at least 100 words. (Current count: ${wordCount})`);
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.email) {
        toast.warning("Email is required for client communications.");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.law_school || !formData.law_degree) {
        toast.warning("Law school and degree are required.");
        return;
      }
    } else if (currentStep === 4) {
      if (statesLicensed.length === 0) {
        toast.warning("Please add at least one State Bar license.");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate YouTube embeds
      const badVideo = youtubeVideos.find(v => {
        return !v.url.includes("youtube.com") && !v.url.includes("youtu.be");
      });
      if (badVideo) {
        toast.error(`Invalid YouTube URL for video: ${badVideo.title}`);
        setLoading(false);
        return;
      }

      const payload = {
        ...formData,
        multiple_offices: JSON.stringify(multipleOffices),
        consultation_types: JSON.stringify(consultationTypes),
        featured_articles: JSON.stringify(featuredArticles),
        youtube_videos: JSON.stringify(youtubeVideos),
        additional_degrees: JSON.stringify(additionalDegrees),
        federal_courts: JSON.stringify(federalCourts),
        appeals_circuits: JSON.stringify(appealsCircuits),
        legal_plans: JSON.stringify(selectedLegalPlans),
        billing_model: JSON.stringify(billingModels),
        flat_fees: JSON.stringify(flatFees),
        payment_methods: JSON.stringify(paymentMethods),
        languages: JSON.stringify(languagesSpoken),
        associations: JSON.stringify(associations),
        awards: JSON.stringify(awards),
        publications: JSON.stringify(publications),
        practice_areas: JSON.stringify(practiceAreas),
        services_offered: JSON.stringify(servicesOffered),
        locations_covered: JSON.stringify(locationsCovered),
        states_licensed: JSON.stringify(statesLicensed),
      };

      let res;
      if (isEdit) {
        res = await api.put(`/api/attorneys/${id}`, payload);
      } else {
        res = await api.post("/api/attorneys", payload);
      }

      if (res.data.success) {
        toast.success(
          isEdit
            ? "Attorney listing updated successfully!"
            : "Attorney listing submitted successfully! Pending admin approval."
        );
        navigate(isEdit ? "/admindashboard/attorneys" : "/postad");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit attorney listing");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center py-32">
          <CircularProgress size={50} sx={{ color: '#b45309' }} />
          <p className="mt-4 text-slate-500 font-medium">Loading listing editor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      {/* Stepper Header */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white py-10 px-[7%] shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold font-dmsans tracking-tight">
              {isEdit ? "✏️ Edit Attorney Posting" : "⚖️ Register Desi Attorney Profile"}
            </h1>
            <p className="mt-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
              Follow the 12-step wizard to create an optimized listing.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 px-5 py-3 rounded-2xl flex flex-col items-center gap-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Profile Completeness</span>
            <span className="text-2xl font-extrabold text-white">{completenessScore}%</span>
            <div className="w-24 bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${completenessScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Wizard Container */}
      <div className="flex-grow max-w-6xl mx-auto w-full px-[7%] py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:w-1/4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm shrink-0 h-fit max-h-[600px]">
          {STEPS.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.id <= currentStep || completenessScore > 30) {
                    setCurrentStep(step.id);
                  }
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-bold transition-all whitespace-nowrap lg:whitespace-normal ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                    : isCompleted
                    ? "text-emerald-600 hover:bg-slate-50"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                <span>{isCompleted ? "✅" : step.icon}</span>
                <span className="hidden lg:inline">{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Content Area */}
        <div className="lg:w-3/4 bg-white rounded-3xl border border-slate-100 shadow-md p-6 md:p-8 flex flex-col gap-6">
          <h2 className="text-lg font-extrabold text-amber-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>{STEPS[currentStep].icon}</span>
            Step {currentStep + 1} of 12: {STEPS[currentStep].label}
          </h2>

          {/* STEP 0: Basic Info & Bio */}
          {currentStep === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">First Name *</label>
                  <input
                    type="text" required name="first_name" value={formData.first_name} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Last Name *</label>
                  <input
                    type="text" required name="last_name" value={formData.last_name} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Profile Photo URL</label>
                  <input
                    type="text" name="profile_photo_url" value={formData.profile_photo_url} onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Short Professional Summary (Max 300 chars) *</label>
                <input
                  type="text" required name="short_bio" maxLength="300" value={formData.short_bio} onChange={handleChange}
                  placeholder="e.g. Experienced Immigration Attorney helping families navigate green card and H1B visa applications."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 font-bold block mt-1">{formData.short_bio.length}/300 characters</span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Full Biography (Min 100 words) *</label>
                <textarea
                  name="full_biography" rows="6" value={formData.full_biography} onChange={handleChange}
                  placeholder="Describe your legal practice, background, client approach, and experience..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-400 font-bold block mt-1">
                  {formData.full_biography.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">NRI Client Statement</label>
                <textarea
                  name="nri_client_statement" rows="2" value={formData.nri_client_statement} onChange={handleChange}
                  placeholder="Highlight your experience handling property disputes, power of attorney, or family disputes in India for NRIs..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Career Summary (Key Milestones)</label>
                <textarea
                  name="career_summary" rows="2" value={formData.career_summary} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Personal Note</label>
                <textarea
                  name="personal_note" rows="2" value={formData.personal_note} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" name="nri_specialisation" checked={formData.nri_specialisation} onChange={handleChange} className="accent-amber-500" />
                  <span className="text-xs font-bold text-slate-700">NRI Specialty Focus</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" name="india_law_knowledge" checked={formData.india_law_knowledge} onChange={handleChange} className="accent-amber-500" />
                  <span className="text-xs font-bold text-slate-700">Knows India Legal/BCI Systems</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 1: Contact Details */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Primary Email *</label>
                  <input
                    type="email" required name="email" value={formData.email} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                  <input
                    type="text" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Office Street Address</label>
                  <input
                    type="text" name="office_address_street" value={formData.office_address_street} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-500 block mb-1">City</label>
                  <input
                    type="text" name="office_address_city" value={formData.office_address_city} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
                <div className="md:col-span-1.5">
                  <label className="text-xs font-bold text-slate-500 block mb-1">State</label>
                  <select name="office_address_state" value={formData.office_address_state} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  >
                    {STATE_OPTIONS.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div className="md:col-span-1.5">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Zipcode</label>
                  <input
                    type="text" name="office_address_zip" value={formData.office_address_zip} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Consultation Methods */}
              <div className="mt-4">
                <label className="text-xs font-bold text-slate-500 block mb-2">Available Consultation Types</label>
                <div className="flex flex-wrap gap-4">
                  {["In-person", "Phone", "Video", "Email"].map(type => {
                    const exists = consultationTypes.includes(type);
                    return (
                      <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exists}
                          onChange={(e) => {
                            if (e.target.checked) setConsultationTypes([...consultationTypes, type]);
                            else setConsultationTypes(consultationTypes.filter(t => t !== type));
                          }}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-700">{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Multiple Offices (Up to 5) */}
              <div className="mt-6 border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Additional Office Locations (Max 5)</h4>
                
                {multipleOffices.length > 0 && (
                  <div className="flex flex-col gap-2 mb-4">
                    {multipleOffices.map((off, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100">
                        <span className="font-semibold text-slate-600">
                          📍 {off.street}, {off.city}, {off.state} {off.zip} (Phone: {off.phone || 'N/A'})
                        </span>
                        <button
                          type="button"
                          onClick={() => setMultipleOffices(multipleOffices.filter((_, idx) => idx !== index))}
                          className="text-red-500 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {multipleOffices.length < 5 && (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                    <input
                      type="text" placeholder="Street" value={tempOffice.street}
                      onChange={e => setTempOffice({...tempOffice, street: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    />
                    <input
                      type="text" placeholder="City" value={tempOffice.city}
                      onChange={e => setTempOffice({...tempOffice, city: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    />
                    <select
                      value={tempOffice.state}
                      onChange={e => setTempOffice({...tempOffice, state: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    >
                      {STATE_OPTIONS.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                    <input
                      type="text" placeholder="Zip" value={tempOffice.zip}
                      onChange={e => setTempOffice({...tempOffice, zip: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempOffice.street && tempOffice.city && tempOffice.zip) {
                          setMultipleOffices([...multipleOffices, tempOffice]);
                          setTempOffice({ street: "", city: "", state: "NJ", zip: "", phone: "" });
                        } else {
                          toast.error("Please fill in street, city and zip code.");
                        }
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      Add Office
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Web & Social */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Website URL</label>
                  <input
                    type="url" name="website_url" value={formData.website_url} onChange={handleChange}
                    placeholder="https://yourlawfirm.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">LinkedIn URL</label>
                  <input
                    type="url" name="linkedin_url" value={formData.linkedin_url} onChange={handleChange}
                    placeholder="https://linkedin.com/in/attorney"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Twitter (X) URL</label>
                  <input
                    type="url" name="twitter_url" value={formData.twitter_url} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Facebook URL</label>
                  <input
                    type="url" name="facebook_url" value={formData.facebook_url} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Instagram URL</label>
                  <input
                    type="url" name="instagram_url" value={formData.instagram_url} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Practice Blog details (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Blog URL</label>
                    <input
                      type="url" name="blog_url" value={formData.blog_url} onChange={handleChange}
                      placeholder="https://yourlawfirm.com/blog"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Blog Platform</label>
                    <input
                      type="text" name="blog_platform" value={formData.blog_platform} onChange={handleChange}
                      placeholder="e.g. Medium, WordPress"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Blog Short Description</label>
                  <textarea
                    name="blog_description" rows="2" value={formData.blog_description} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* YouTube Video embeds (Max 2) */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">YouTube Videos (Max 2, privacy-enhanced nocookie URLs)</h4>
                
                {youtubeVideos.map((vid, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                    <span className="font-semibold text-slate-600">🎥 {vid.title} ({vid.url})</span>
                    <button
                      type="button"
                      onClick={() => setYoutubeVideos(youtubeVideos.filter((_, idx) => idx !== index))}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {youtubeVideos.length < 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                    <input
                      type="text" placeholder="Video Title" value={tempVideo.title}
                      onChange={e => setTempVideo({...tempVideo, title: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    />
                    <input
                      type="url" placeholder="YouTube URL" value={tempVideo.url}
                      onChange={e => setTempVideo({...tempVideo, url: e.target.value})}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempVideo.title && tempVideo.url) {
                          setYoutubeVideos([...youtubeVideos, tempVideo]);
                          setTempVideo({ title: "", url: "" });
                        } else {
                          toast.error("Please enter video title and URL.");
                        }
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                    >
                      Add Video
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Education */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">Law School Name *</label>
                  <input
                    type="text" required name="law_school" value={formData.law_school} onChange={handleChange}
                    placeholder="e.g. Harvard Law School"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Degree Earned (e.g. JD, LLM) *</label>
                  <input
                    type="text" required name="law_degree" value={formData.law_degree} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Graduation Year</label>
                  <input
                    type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Law School Honours / Awards</label>
                  <input
                    type="text" name="law_school_honours" value={formData.law_school_honours} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Undergraduate Education (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 block mb-1">Undergraduate Institution</label>
                    <input
                      type="text" name="undergraduate_institution" value={formData.undergraduate_institution} onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Degree Earned (e.g. BA, BS)</label>
                    <input
                      type="text" name="undergraduate_degree" value={formData.undergraduate_degree} onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Graduation Year</label>
                    <input
                      type="number" name="undergraduate_year" value={formData.undergraduate_year} onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Degrees */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Additional Degrees (e.g. LLM, MBA, PhD)</h4>
                
                {additionalDegrees.map((deg, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                    <span className="font-semibold text-slate-600">🎓 {deg.degree} in {deg.subject} - {deg.institution} ({deg.year})</span>
                    <button
                      type="button"
                      onClick={() => setAdditionalDegrees(additionalDegrees.filter((_, idx) => idx !== index))}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                  <input
                    type="text" placeholder="Institution" value={tempDegree.institution}
                    onChange={e => setTempDegree({...tempDegree, institution: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                  />
                  <input
                    type="text" placeholder="Degree" value={tempDegree.degree}
                    onChange={e => setTempDegree({...tempDegree, degree: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                  />
                  <input
                    type="text" placeholder="Subject" value={tempDegree.subject}
                    onChange={e => setTempDegree({...tempDegree, subject: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                  />
                  <input
                    type="number" placeholder="Year" value={tempDegree.year}
                    onChange={e => setTempDegree({...tempDegree, year: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempDegree.institution && tempDegree.degree && tempDegree.year) {
                        setAdditionalDegrees([...additionalDegrees, tempDegree]);
                        setTempDegree({ institution: "", degree: "", year: "", subject: "" });
                      } else {
                        toast.error("Please fill in institution, degree and year.");
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                  >
                    Add Degree
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Bar & Jurisdictions */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              {/* State Licenses */}
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2">State Bar Licenses (At least 1 required) *</h4>
                
                {statesLicensed.map((lic, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                    <span className="font-semibold text-slate-600">🏛️ State Bar of {lic.state} - Bar #: {lic.bar_number || 'N/A'} (Admitted: {lic.year_admitted || 'N/A'})</span>
                    <button
                      type="button"
                      onClick={() => setStatesLicensed(statesLicensed.filter((_, idx) => idx !== index))}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <select
                    value={tempLicense.state}
                    onChange={e => setTempLicense({...tempLicense, state: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    {STATE_OPTIONS.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <input
                    type="text" placeholder="Bar Number" value={tempLicense.bar_number}
                    onChange={e => setTempLicense({...tempLicense, bar_number: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                  />
                  <input
                    type="number" placeholder="Year Admitted" value={tempLicense.year_admitted}
                    onChange={e => setTempLicense({...tempLicense, year_admitted: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempLicense.state) {
                        setStatesLicensed([...statesLicensed, tempLicense]);
                        setTempLicense({ state: "NJ", year_admitted: "", bar_number: "" });
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                  >
                    Add License
                  </button>
                </div>
              </div>

              {/* Federal Admissions */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Federal District Courts & Circuit Admissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">Federal District Courts (Comma separated)</label>
                    <input
                      type="text" placeholder="e.g. Southern District of New York"
                      onBlur={e => setFederalCourts(e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">US Appeals Circuits (Comma separated)</label>
                    <input
                      type="text" placeholder="e.g. 2nd Circuit, 9th Circuit"
                      onBlur={e => setAppealsCircuits(e.target.value.split(',').map(c => c.trim()).filter(Boolean))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="us_supreme_court" checked={formData.us_supreme_court} onChange={handleChange} className="accent-amber-500" />
                    <span className="text-xs font-bold text-slate-700">US Supreme Court Admitted</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="eoir_admitted" checked={formData.eoir_admitted} onChange={handleChange} className="accent-amber-500" />
                    <span className="text-xs font-bold text-slate-700">Executive Office for Immigration Review (EOIR) Admitted</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" name="us_tax_court" checked={formData.us_tax_court} onChange={handleChange} className="accent-amber-500" />
                    <span className="text-xs font-bold text-slate-700">US Tax Court Admitted</span>
                  </label>
                </div>
              </div>

              {/* India Bar Council (BCI) */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Bar Council of India (BCI) / Advocates Act Admissions</h4>
                <div className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input type="checkbox" name="india_bci" checked={formData.india_bci} onChange={handleChange} className="accent-amber-500" />
                  <span className="text-xs font-bold text-slate-700">Admitted / Registered with Bar Council of India</span>
                </div>
                {formData.india_bci && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">BCI Registration / State Bar Council details</label>
                    <input
                      type="text" name="india_bci_details" value={formData.india_bci_details} onChange={handleChange}
                      placeholder="e.g. Maharashtra & Goa Bar Council (Reg #: MAH/123/2012)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="text-xs font-bold text-slate-500 block mb-1">Other Jurisdictions Admitted</label>
                <textarea
                  name="other_jurisdictions" rows="2" value={formData.other_jurisdictions} onChange={handleChange}
                  placeholder="e.g. Solicitor in England & Wales"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Practice Areas */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Practice Areas (Select up to 8)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {PRACTICE_AREAS.map(pa => {
                    const exists = practiceAreas.includes(pa);
                    return (
                      <label key={pa} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exists}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (practiceAreas.length >= 8) {
                                toast.error("You can select up to 8 practice areas.");
                                return;
                              }
                              setPracticeAreas([...practiceAreas, pa]);
                            } else {
                              setPracticeAreas(practiceAreas.filter(p => p !== pa));
                            }
                          }}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-700">{pa}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Specific Services (Max 10) */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Detailed Services Offered (Max 10)</h4>
                
                {servicesOffered.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {servicesOffered.map((serv, index) => (
                      <span key={index} className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                        {serv}
                        <button type="button" onClick={() => setServicesOffered(servicesOffered.filter((_, idx) => idx !== index))} className="text-red-500 hover:underline">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {servicesOffered.length < 10 && (
                  <div className="flex gap-2">
                    <input
                      type="text" placeholder="e.g. H1B Visa Filing, Divorce Mediation, Will Drafting" value={tempService}
                      onChange={e => setTempService(e.target.value)}
                      className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tempService.trim()) {
                          setServicesOffered([...servicesOffered, tempService.trim()]);
                          setTempService("");
                        }
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-6 rounded-xl transition-all"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 6: Fees & Legal Plans */}
          {currentStep === 6 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Consultation Fee ($)</label>
                  <input
                    type="number" name="consultation_fee_amount" value={formData.consultation_fee_amount} onChange={handleChange}
                    placeholder="0 for free consultation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Consultation Duration</label>
                  <select name="consultation_duration" value={formData.consultation_duration} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="15_min">15 Minutes</option>
                    <option value="30_min">30 Minutes</option>
                    <option value="60_min">60 Minutes</option>
                  </select>
                </div>
              </div>

              {/* Billing Models */}
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Billing & Fee Models Available</label>
                <div className="flex flex-wrap gap-4">
                  {["hourly", "flat_fee", "contingency", "retainer", "pro_bono"].map(model => {
                    const exists = billingModels.includes(model);
                    return (
                      <label key={model} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={exists}
                          onChange={(e) => {
                            if (e.target.checked) setBillingModels([...billingModels, model]);
                            else setBillingModels(billingModels.filter(m => m !== model));
                          }}
                          className="accent-amber-500"
                        />
                        <span className="text-xs font-bold text-slate-700 capitalize">{model.replace('_', ' ')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Legal Plans Badges */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 mb-2 cursor-pointer select-none">
                  <input type="checkbox" name="accepts_legal_plans" checked={formData.accepts_legal_plans} onChange={handleChange} className="accent-amber-500" />
                  <span className="text-xs font-bold text-slate-700">Accepts Legal Insurance Plans</span>
                </div>

                {formData.accepts_legal_plans && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 block">Select Legal Insurance networks you are registered with:</label>
                    <div className="flex flex-wrap gap-4">
                      {LEGAL_PLANS.map(plan => {
                        const exists = selectedLegalPlans.some(p => p.plan_name === plan.plan_name);
                        return (
                          <label key={plan.plan_name} className="flex items-center gap-2 cursor-pointer select-none p-2 border border-slate-100 rounded-xl hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={exists}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLegalPlans([...selectedLegalPlans, { ...plan, verified: false }]);
                                } else {
                                  setSelectedLegalPlans(selectedLegalPlans.filter(p => p.plan_name !== plan.plan_name));
                                }
                              }}
                              className="accent-amber-500"
                            />
                            <span className="text-xs font-bold text-slate-700">{plan.plan_name}</span>
                          </label>
                        );
                      })}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">Legal Plans Note</label>
                      <input
                        type="text" name="legal_plans_note" value={formData.legal_plans_note} onChange={handleChange}
                        placeholder="e.g. Please provide your plan number prior to the consult."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flat Fee Services list */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-slate-700 mb-2">Flat Fee Services Pricing (Optional)</h4>
                
                {flatFees.map((flat, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                    <span className="font-semibold text-slate-600">💵 {flat.service_name} - Flat Fee: ${flat.fee_amount}</span>
                    <button
                      type="button"
                      onClick={() => setFlatFees(flatFees.filter((_, idx) => idx !== index))}
                      className="text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <input
                    type="text" placeholder="Service (e.g. Simple Will)" value={tempFlatFee.service_name}
                    onChange={e => setTempFlatFee({...tempFlatFee, service_name: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                  />
                  <input
                    type="number" placeholder="Fee ($)" value={tempFlatFee.fee_amount}
                    onChange={e => setTempFlatFee({...tempFlatFee, fee_amount: e.target.value})}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempFlatFee.service_name && tempFlatFee.fee_amount) {
                        setFlatFees([...flatFees, tempFlatFee]);
                        setTempFlatFee({ service_name: "", fee_amount: "" });
                      }
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Languages */}
          {currentStep === 7 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Languages Spoken & Proficiency</h4>
              
              {languagesSpoken.map((lang, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                  <span className="font-semibold text-slate-600">🗣️ {lang.language} - {lang.proficiency}</span>
                  <button
                    type="button"
                    disabled={languagesSpoken.length === 1 && lang.language === "English"}
                    onClick={() => setLanguagesSpoken(languagesSpoken.filter((_, idx) => idx !== index))}
                    className="text-red-500 font-bold hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                <select
                  value={tempLang.language}
                  onChange={e => setTempLang({...tempLang, language: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer"
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select
                  value={tempLang.proficiency}
                  onChange={e => setTempLang({...tempLang, proficiency: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!languagesSpoken.some(l => l.language === tempLang.language)) {
                      setLanguagesSpoken([...languagesSpoken, tempLang]);
                    } else {
                      toast.warning(`${tempLang.language} is already added.`);
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Add Language
                </button>
              </div>
            </div>
          )}

          {/* STEP 8: Associations */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Professional Bar Associations & Committees</h4>
              
              {associations.map((assoc, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                  <span className="font-semibold text-slate-600">🤝 {assoc.name} ({assoc.year}) - Role: {assoc.role || 'Member'} ({assoc.type})</span>
                  <button
                    type="button"
                    onClick={() => setAssociations(associations.filter((_, idx) => idx !== index))}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <input
                  type="text" placeholder="Association Name" value={tempAssoc.name}
                  onChange={e => setTempAssoc({...tempAssoc, name: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <input
                  type="number" placeholder="Year Joined" value={tempAssoc.year}
                  onChange={e => setTempAssoc({...tempAssoc, year: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                />
                <input
                  type="text" placeholder="Role (e.g. Chair)" value={tempAssoc.role}
                  onChange={e => setTempAssoc({...tempAssoc, role: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <select
                  value={tempAssoc.type}
                  onChange={e => setTempAssoc({...tempAssoc, type: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-amber-500"
                >
                  <option value="State Bar">State Bar</option>
                  <option value="National Association">National Association</option>
                  <option value="South Asian Bar">South Asian Bar (SABA)</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (tempAssoc.name && tempAssoc.year) {
                      setAssociations([...associations, tempAssoc]);
                      setTempAssoc({ name: "", year: "", role: "", type: "State Bar" });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Add Association
                </button>
              </div>
            </div>
          )}

          {/* STEP 9: Awards */}
          {currentStep === 9 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Awards & Honors</h4>
              
              {awards.map((aw, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                  <span className="font-semibold text-slate-600">🏆 {aw.name} - {aw.organisation} ({aw.year})</span>
                  <button
                    type="button"
                    onClick={() => setAwards(awards.filter((_, idx) => idx !== index))}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                <input
                  type="text" placeholder="Award Name" value={tempAward.name}
                  onChange={e => setTempAward({...tempAward, name: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <input
                  type="text" placeholder="Awarding Org" value={tempAward.organisation}
                  onChange={e => setTempAward({...tempAward, organisation: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <input
                  type="number" placeholder="Year" value={tempAward.year}
                  onChange={e => setTempAward({...tempAward, year: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500 font-mono"
                />
                <input
                  type="text" placeholder="Category" value={tempAward.category}
                  onChange={e => setTempAward({...tempAward, category: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (tempAward.name && tempAward.organisation && tempAward.year) {
                      setAwards([...awards, tempAward]);
                      setTempAward({ name: "", organisation: "", year: "", category: "" });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Add Award
                </button>
              </div>
            </div>
          )}

          {/* STEP 10: Publications */}
          {currentStep === 10 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2">Legal Publications & Articles</h4>
              
              {publications.map((pub, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-xl text-xs border border-slate-100 mb-2">
                  <span className="font-semibold text-slate-600">
                    📖 {pub.title} ({pub.type}) - {pub.publisher} ({pub.date}) {pub.featured && "⭐ Featured"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPublications(publications.filter((_, idx) => idx !== index))}
                    className="text-red-500 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                <input
                  type="text" placeholder="Publication Title" value={tempPub.title}
                  onChange={e => setTempPub({...tempPub, title: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <select
                  value={tempPub.type}
                  onChange={e => setTempPub({...tempPub, type: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Article">Article</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Case Law Note">Case Law Note</option>
                  <option value="Treatise">Treatise</option>
                </select>
                <input
                  type="text" placeholder="Publisher" value={tempPub.publisher}
                  onChange={e => setTempPub({...tempPub, publisher: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <input
                  type="text" placeholder="Date (e.g. May 2024)" value={tempPub.date}
                  onChange={e => setTempPub({...tempPub, date: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center mt-2">
                <input
                  type="url" placeholder="Article Link / URL" value={tempPub.url}
                  onChange={e => setTempPub({...tempPub, url: e.target.value})}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-amber-500"
                />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={tempPub.featured}
                    onChange={e => setTempPub({...tempPub, featured: e.target.checked})}
                    className="accent-amber-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Mark as Featured</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (tempPub.title) {
                      setPublications([...publications, tempPub]);
                      setTempPub({ title: "", type: "Article", publisher: "", date: "", url: "", featured: false });
                    }
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl transition-all"
                >
                  Add Publication
                </button>
              </div>
            </div>
          )}

          {/* STEP 11: Review & Submit */}
          {currentStep === 11 && (
            <div className="flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm">
                <h4 className="font-extrabold text-amber-900 mb-2 flex items-center gap-2">
                  <span>📝</span> Verification Checklist
                </h4>
                <ul className="flex flex-col gap-1 text-xs text-amber-800 list-disc pl-4 font-medium">
                  <li>Your Name: <span className="font-bold">{formData.first_name} {formData.last_name}</span></li>
                  <li>Email for leads: <span className="font-bold">{formData.email}</span></li>
                  <li>Primary Bar Licenses: <span className="font-bold">{statesLicensed.map(l => l.state).join(', ')}</span></li>
                  <li>Profile Completeness: <span className="font-extrabold text-amber-900">{completenessScore}%</span></li>
                </ul>
              </div>

              <div className="text-xs text-slate-500 font-medium">
                <p>
                  By submitting this profile, you warrant that all information regarding your educational credentials, bar admissions, and legal qualifications is accurate. All listings are subject to administrative review and approval before appearing in public searches.
                </p>
              </div>
            </div>
          )}

          {/* Stepper Navigation Actions */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4">
            <button
              type="button"
              disabled={currentStep === 0}
              onClick={handleBack}
              className="bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs py-3 px-6 rounded-xl transition-all disabled:opacity-40"
            >
              ⬅️ Back
            </button>

            {currentStep === STEPS.length - 1 ? (
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                {loading ? <CircularProgress size={16} sx={{ color: 'white' }} /> : "🚀 Submit Application"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-3 px-8 rounded-xl shadow-md transition-all flex items-center gap-1"
              >
                Next Step ➡️
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
