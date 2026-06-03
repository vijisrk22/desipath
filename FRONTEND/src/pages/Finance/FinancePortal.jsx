import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { toast } from 'react-toastify';

export default function FinancePortal({ mode = 'post' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState([]);
  
  const [formData, setFormData] = useState({
    firm_name: '',
    consultant_name: '',
    years_experience: 0,
    nri_specialist_statement: '',
    qualifications: '',
    accreditations: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    free_consultation: '',
    fee_structure_type: 'fee_only',
    minimum_investment: '',
    primary_city: '',
    finra_crd_number: '',
    fbar_fatca_advisory: false,
    pfic_advisory: false,
    dtaa_optimization: false,
    virtual_consultation: true,
    services: [],
    states_licensed: [],
  });

  const [files, setFiles] = useState({
    advisor_profile_image: null,
    cover_image: null
  });

  const usStates = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  
  const categoriesList = [
    "401k", "Annuity", "Health Insurance", "Life Insurance", 
    "Travel Insurance", "Auto Insurance", "Will & Trust", 
    "College Savings", "US-Tax", "India-Tax"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles.length > 0) {
      setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    }
  };

  const handleCitySearch = async (val) => {
    setFormData(prev => ({ ...prev, primary_city: val }));
    if (val.length > 1) {
      try {
        const parts = val.split(',').map(p => p.trim());
        const searchTerm = parts[parts.length - 1];
        if (searchTerm.length < 2) return;
        const res = await api.get(`/api/location/locations?filter=${searchTerm}`);
        const data = res.data?.value || (Array.isArray(res.data) ? res.data : []);
        setCitySuggestions(data.map(loc => `${loc.city}, ${loc.state_name}, ${loc.zip}`));
      } catch (err) {
        console.error(err);
      }
    } else {
      setCitySuggestions([]);
    }
  };

  const handleStateChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, states_licensed: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'services' || key === 'states_licensed') {
        submitData.append(key, JSON.stringify(formData[key]));
      } else {
        submitData.append(key, formData[key] === null ? '' : formData[key]);
      }
    });

    if (files.advisor_profile_image) {
      submitData.append('advisor_profile_image', files.advisor_profile_image);
    }
    if (files.cover_image) {
      submitData.append('cover_image', files.cover_image);
    }
    
    // Add method spoofing for PUT since PHP doesn't easily read multipart/form-data on PUT
    if (mode === 'edit') {
      submitData.append('_method', 'PUT');
    }

    try {
      if (mode === 'edit') {
        await api.post(`/api/financial-advisors/${id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Profile updated!");
      } else {
        await api.post('/api/financial-advisors', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success("Advisor Profile Created!");
      }
      navigate('/profile/myListings');
    } catch (err) {
      console.error(err);
      toast.error("Error saving profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Financial Advisor Portal</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-8">
          
          {/* Identity & Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Identity & Branding</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Consultant Full Name</label>
                <input name="consultant_name" value={formData.consultant_name} onChange={handleChange} required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Firm Name</label>
                <input name="firm_name" value={formData.firm_name} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture (Optional)</label>
                <input type="file" name="advisor_profile_image" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Background / Cover Image (Like LinkedIn)</label>
                <input type="file" name="cover_image" accept="image/*" onChange={handleFileChange} className="w-full border border-gray-300 p-2 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Credentials & Contact */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Credentials & Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Qualifications (e.g. MBA, Finance)</label>
                <input name="qualifications" value={formData.qualifications} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Accreditations (e.g. CPA, CFP)</label>
                <input name="accreditations" value={formData.accreditations} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Years of Experience</label>
                <input type="number" name="years_experience" value={formData.years_experience} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">FINRA CRD Number (Optional)</label>
                <input name="finra_crd_number" value={formData.finra_crd_number} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* Location & Practice */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Location & Practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium mb-1">Primary City / Zip Code</label>
                <input 
                  name="primary_city" 
                  value={formData.primary_city} 
                  onChange={(e) => handleCitySearch(e.target.value)} 
                  required 
                  autoComplete="off"
                  placeholder="e.g. New York, NY or 10001"
                  className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
                {citySuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {citySuggestions.map((s, i) => (
                      <div 
                        key={i} 
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 transition text-gray-700" 
                        onClick={() => {
                          setFormData(prev => ({...prev, primary_city: s}));
                          setCitySuggestions([]);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Licensed States (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple name="states_licensed" value={formData.states_licensed} onChange={handleStateChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 h-32">
                  {usStates.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fee Structure</label>
                <select name="fee_structure_type" value={formData.fee_structure_type} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="fee_only">Fee-Only</option>
                  <option value="fee_based">Fee-Based</option>
                  <option value="aum">AUM %</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Free 1-1 Consultation</label>
                <select name="free_consultation" value={formData.free_consultation} onChange={handleChange} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">None</option>
                  <option value="15 min">15 min call</option>
                  <option value="30 min">30 min call</option>
                  <option value="60 min">60 min call</option>
                </select>
              </div>
            </div>
          </div>

          {/* NRI Statement */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800 font-bold">NRI Specialist Statement (Minimum 50 words recommended)</label>
            <p className="text-gray-500 text-xs mb-2">Explain exactly how you help Non-Resident Indians navigate complex financial rules.</p>
            <textarea name="nri_specialist_statement" value={formData.nri_specialist_statement} onChange={handleChange} rows="4" className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Describe your experience helping NRIs..."></textarea>
          </div>

          {/* Services & Toggles */}
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-4">NRI Specialties (Check all that apply)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition">
                <input type="checkbox" name="pfic_advisory" checked={formData.pfic_advisory} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-medium text-gray-700">PFIC Advisory (Form 8621)</span>
              </label>
              <label className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition">
                <input type="checkbox" name="fbar_fatca_advisory" checked={formData.fbar_fatca_advisory} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-medium text-gray-700">FBAR & FATCA Compliance</span>
              </label>
              <label className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 transition">
                <input type="checkbox" name="dtaa_optimization" checked={formData.dtaa_optimization} onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-medium text-gray-700">India-US DTAA Optimization</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Service Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {categoriesList.map(cat => (
                <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.services.includes(cat)} 
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({...prev, services: [...prev.services, cat]}));
                      } else {
                        setFormData(prev => ({...prev, services: prev.services.filter(s => s !== cat)}));
                      }
                    }}
                    className="text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t mt-8">
            <button type="submit" disabled={loading} className="w-full bg-[#f15a29] text-white py-4 rounded-xl text-lg font-bold hover:bg-orange-600 transition shadow-lg transform hover:-translate-y-1">
              {loading ? 'Saving...' : (mode === 'edit' ? 'Update Profile' : 'Publish Profile')}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
