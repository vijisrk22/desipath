import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";

const INSURANCE_OPTIONS = [
  "Blue Cross Blue Shield",
  "Aetna",
  "Cigna",
  "UnitedHealthcare",
  "Medicare",
  "Humana",
  "Kaiser Permanente"
];

const INDIAN_HEALTH_OPTIONS = [
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

const STATE_OPTIONS = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function DoctorAdPortal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    credential: "MD",
    gender: "male",
    primary_specialty: "Family Practice",
    practice_name: "",
    practice_type: "solo",
    npi_number: "",
    phone: "",
    email: "",
    fax: "",
    website_url: "",
    appointment_booking_url: "",
    primary_address_street: "",
    primary_address_city: "",
    primary_address_state: "NJ",
    primary_address_zip: "",
    headline: "",
    bio: "",
    nri_specialist_statement: "",
    cultural_background: "",
    india_medical_college: "",
    telehealth_available: false,
    visiting_parents_care: false,
    medical_proxy_assistance: false,
    nri_specialist: false,
    accepting_new_patients: true,
  });

  const [selectedInsurances, setSelectedInsurances] = useState([]);
  const [selectedIndianHealth, setSelectedIndianHealth] = useState([]);

  // Fetch for Edit Mode
  useEffect(() => {
    if (isEdit) {
      const fetchDoctor = async () => {
        setFetching(true);
        try {
          // Admin index or regular route can get it. Let's try regular show endpoint or query standard details.
          const res = await api.get(`/api/doctors`);
          if (res.data.success) {
            const doc = res.data.data.find(d => d.doctor_id === parseInt(id));
            if (doc) {
              setFormData({
                first_name: doc.first_name || "",
                last_name: doc.last_name || "",
                credential: doc.credential || "MD",
                gender: doc.gender || "male",
                primary_specialty: doc.primary_specialty || "Family Practice",
                practice_name: doc.practice_name || "",
                practice_type: doc.practice_type || "solo",
                npi_number: doc.npi_number || "",
                phone: doc.phone || "",
                email: doc.email || "",
                fax: doc.fax || "",
                website_url: doc.website_url || "",
                appointment_booking_url: doc.appointment_booking_url || "",
                primary_address_street: doc.primary_address_street || "",
                primary_address_city: doc.primary_address_city || "",
                primary_address_state: doc.primary_address_state || "NJ",
                primary_address_zip: doc.primary_address_zip || "",
                headline: doc.headline || "",
                bio: doc.bio || "",
                nri_specialist_statement: doc.nri_specialist_statement || "",
                cultural_background: doc.cultural_background || "",
                india_medical_college: doc.india_medical_college || "",
                telehealth_available: !!doc.telehealth_available,
                visiting_parents_care: !!doc.visiting_parents_care,
                medical_proxy_assistance: !!doc.medical_proxy_assistance,
                nri_specialist: !!doc.nri_specialist,
                accepting_new_patients: !!doc.accepting_new_patients,
              });
              setSelectedInsurances(doc.insurance_plans_json || []);
              setSelectedIndianHealth(doc.indian_health_specialisations_json || []);
            }
          }
        } catch (err) {
          toast.error("Failed to load doctor profile for editing");
          console.error(err);
        } finally {
          setFetching(false);
        }
      };
      fetchDoctor();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleInsuranceToggle = (plan) => {
    setSelectedInsurances((prev) => 
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  const handleIndianHealthToggle = (opt) => {
    setSelectedIndianHealth((prev) => 
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        insurance_plans: JSON.stringify(selectedInsurances),
        indian_health_specialisations: JSON.stringify(selectedIndianHealth)
      };

      let res;
      if (isEdit) {
        res = await api.put(`/api/doctors/${id}`, payload);
      } else {
        res = await api.post("/api/doctors", payload);
      }

      if (res.data.success) {
        toast.success(
          isEdit 
            ? "Doctor listing updated successfully!" 
            : "Doctor listing submitted successfully! Pending admin approval."
        );
        navigate(isEdit ? "/admindashboard/doctors" : "/postad");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit doctor listing");
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
          <CircularProgress size={50} sx={{ color: '#0284c7' }} />
          <p className="mt-4 text-slate-500 font-bold">Loading listing editor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Header */}
      <div className="bg-[#0284c7] text-white py-12 px-[7%] shadow-md">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold font-dmsans tracking-tight">
            {isEdit ? "✏️ Edit Doctor Posting" : "👨‍⚕️ List Your Medical Practice"}
          </h1>
          <p className="mt-2 text-sky-100 text-sm font-medium">
            Fill in details to showcase your clinical background, languages spoken, NPI verification, and custom South Asian healthcare programs.
          </p>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-grow max-w-4xl mx-auto w-full px-[7%] py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 md:p-8 flex flex-col gap-8 text-gray-800">
          
          {/* Section 1: Basic Bio */}
          <div>
            <h3 className="text-base font-extrabold text-sky-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
              1. Basic Credentials & Bio
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">First Name *</label>
                <input 
                  type="text" required name="first_name" value={formData.first_name} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Last Name *</label>
                <input 
                  type="text" required name="last_name" value={formData.last_name} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Credential (MD/MBBS) *</label>
                <input 
                  type="text" required name="credential" value={formData.credential} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Primary Specialty *</label>
                <input 
                  type="text" required name="primary_specialty" value={formData.primary_specialty} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">NPI Number (10 digits)</label>
                <input 
                  type="text" name="npi_number" maxLength="10" value={formData.npi_number} onChange={handleChange}
                  placeholder="e.g. 1007043673"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Profile Headline</label>
                <input 
                  type="text" name="headline" value={formData.headline} onChange={handleChange}
                  placeholder="e.g. Board Certified Family Physician & South Asian Diabetes Specialist"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Professional Biography</label>
                <textarea 
                  name="bio" rows="4" value={formData.bio} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Info & Address */}
          <div>
            <h3 className="text-base font-extrabold text-sky-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
              2. Practice Location & Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Practice/Group Name</label>
                <input 
                  type="text" name="practice_name" value={formData.practice_name} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Practice Type</label>
                <select name="practice_type" value={formData.practice_type} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="solo">Solo Practice</option>
                  <option value="group">Group Practice</option>
                  <option value="hospital">Hospitalist</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Phone Number *</label>
                <input 
                  type="text" required name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Email Address *</label>
                <input 
                  type="email" required name="email" value={formData.email} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Website URL</label>
                <input 
                  type="url" name="website_url" value={formData.website_url} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Appointment Booking URL</label>
                <input 
                  type="url" name="appointment_booking_url" value={formData.appointment_booking_url} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-500 block mb-1">Street Address *</label>
                <input 
                  type="text" required name="primary_address_street" value={formData.primary_address_street} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">City *</label>
                <input 
                  type="text" required name="primary_address_city" value={formData.primary_address_city} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">State *</label>
                <select name="primary_address_state" value={formData.primary_address_state} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-sky-500 cursor-pointer scrollbar-none"
                >
                  {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Zipcode *</label>
                <input 
                  type="text" required name="primary_address_zip" value={formData.primary_address_zip} onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: NRI Features & Cultural Background */}
          <div>
            <h3 className="text-base font-extrabold text-sky-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
              3. Indian / South Asian Health & Background
            </h3>

            {/* Custom Indian Health Checks */}
            <div className="mb-6">
              <label className="text-xs font-extrabold text-gray-500 block mb-3 uppercase tracking-wider">
                Select Indian/South Asian Health Programs Spanned:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {INDIAN_HEALTH_OPTIONS.map((opt) => {
                  const active = selectedIndianHealth.includes(opt);
                  return (
                    <button
                      key={opt} type="button"
                      onClick={() => handleIndianHealthToggle(opt)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        active 
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-slate-50 text-gray-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {active ? "✓ " : "+ "} {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Cultural / Regional Heritage Background</label>
                <input 
                  type="text" name="cultural_background" value={formData.cultural_background} onChange={handleChange}
                  placeholder="e.g. South Indian (Chennai, Tamil Nadu) or Gujarati"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">India Medical College Details</label>
                <input 
                  type="text" name="india_medical_college" value={formData.india_medical_college} onChange={handleChange}
                  placeholder="e.g. MBBS - Madras Medical College"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-gray-500 block mb-1">NRI Specialist Patient Statement (Min 50 Words)</label>
              <textarea 
                name="nri_specialist_statement" rows="3" value={formData.nri_specialist_statement} onChange={handleChange}
                placeholder="Share a welcoming note specifically highlighting how your clinic supports South Asian cultural values, vegetarian cooking, fast habits, and parent care proxy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium outline-none focus:border-sky-500"
              />
            </div>

            {/* Quick Toggle Flags */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" name="telehealth_available" checked={formData.telehealth_available} onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-gray-700">💻 Telehealth Available</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" name="visiting_parents_care" checked={formData.visiting_parents_care} onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-gray-700">👴 Parent Visa Friendly</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" name="medical_proxy_assistance" checked={formData.medical_proxy_assistance} onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-gray-700">📜 Medical Proxy Support</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" name="accepting_new_patients" checked={formData.accepting_new_patients} onChange={handleChange}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="text-xs font-bold text-gray-700">✨ Accepting Patients</span>
              </label>
            </div>
          </div>

          {/* Section 4: Insurances */}
          <div>
            <h3 className="text-base font-extrabold text-sky-800 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
              4. Insurance Support
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {INSURANCE_OPTIONS.map((plan) => {
                const active = selectedInsurances.includes(plan);
                return (
                  <button
                    key={plan} type="button"
                    onClick={() => handleInsuranceToggle(plan)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      active 
                        ? "bg-[#0284c7] text-white border-[#0284c7] shadow-sm"
                        : "bg-slate-50 text-gray-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {active ? "✓ " : "+ "} {plan}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-4">
            <Link
              to={isEdit ? "/admindashboard/doctors" : "/postad"}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider"
            >
              Cancel & Exit
            </Link>
            <button
              type="submit" disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm py-3 px-8 rounded-xl transition-all shadow-md active:scale-95 disabled:bg-slate-300"
            >
              {loading ? (
                <div className="flex items-center gap-1.5 justify-center">
                  <CircularProgress size={16} sx={{ color: 'white' }} />
                  <span>Saving Listing...</span>
                </div>
              ) : (
                isEdit ? "Update Doctor Listing" : "Submit Listing for Approval"
              )}
            </button>
          </div>

        </form>
      </div>

      <Footer />
    </div>
  );
}
