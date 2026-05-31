import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';
import { useForm } from 'react-hook-form';

const VISA_OPTIONS = ["H1B", "H4 EAD", "GC", "USC", "OPT/CPT", "TN"];
const JOB_TYPE_OPTIONS = ["C2C", "W2-Contract", "W2-full time"];

const ItJobPortal = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    description: '',
    skillsStr: '',
    visa_requirements: [],
    job_types: [],
    h1b_transfer_available: false
  });

  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'h1b_transfer_available') {
        setFormData({ ...formData, [name]: checked });
      } else if (name === 'visa_requirements' || name === 'job_types') {
        let updatedArray = [...formData[name]];
        if (checked) {
          updatedArray.push(value);
        } else {
          updatedArray = updatedArray.filter(v => v !== value);
        }
        setFormData({ ...formData, [name]: updatedArray });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    let city = '';
    let state = '';
    let zipcode = '';

    if (locationValue) {
      const parts = locationValue.split(',').map(p => p.trim());
      if (parts.length >= 3) {
         city = parts[0];
         state = parts[1];
         zipcode = parts[parts.length - 1];
      } else if (parts.length === 2) {
         city = parts[0];
         state = parts[1];
      }
    }

    const skillsArray = formData.skillsStr.split(',').map(s => s.trim()).filter(s => s);

    try {
      await api.post('/api/jobs/it', { 
        title: formData.title,
        company_name: formData.company_name,
        description: formData.description,
        skills: skillsArray,
        visa_requirements: formData.visa_requirements,
        job_types: formData.job_types,
        h1b_transfer_available: formData.h1b_transfer_available,
        city, 
        state, 
        zipcode 
      });
      toast.success("IT Job posted successfully!");
      navigate('/jobs/it');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 pt-10 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-purple-600 hover:underline font-medium">Home</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-purple-600 hover:underline font-medium">Jobs</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs/it')} className="cursor-pointer hover:text-purple-600 hover:underline font-medium">IT Jobs</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-semibold">Post</span>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-8">
              <h1 className="text-3xl font-extrabold">Post an IT Job</h1>
              <p className="opacity-90 mt-2 text-lg">Post roles for consultancies and find top IT talent.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. Senior Java Developer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Company / Consultancy Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. Tech Solutions Inc." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location</label>
                <LocationAutocompleteInput 
                  control={control} 
                  setValue={setValue} 
                  type="search" 
                  placeholder="City, State or Zipcode (Leave blank for Remote)" 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 bg-gray-50 focus-within:bg-white py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Required Skills</label>
                <input type="text" name="skillsStr" value={formData.skillsStr} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. React, Node.js, AWS (comma separated)" />
              </div>

              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-4">Visa & Requirements</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Accepted Visa Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {VISA_OPTIONS.map(visa => (
                      <label key={visa} className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="visa_requirements" 
                          value={visa}
                          checked={formData.visa_requirements.includes(visa)}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{visa}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Job Types</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {JOB_TYPE_OPTIONS.map(type => (
                      <label key={type} className="flex items-center">
                        <input 
                          type="checkbox" 
                          name="job_types" 
                          value={type}
                          checked={formData.job_types.includes(type)}
                          onChange={handleChange}
                          className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="h1b_transfer_available"
                      checked={formData.h1b_transfer_available}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm font-bold text-gray-800">H1B Transfer Available</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Description <span className="text-red-500">*</span></label>
                <textarea required name="description" rows="6" value={formData.description} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="Detailed job description..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={submitting} className={`w-full text-lg font-bold py-4 px-6 rounded-xl text-white shadow-xl transition-all duration-300 ${submitting ? 'bg-purple-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-indigo-800 hover:shadow-2xl hover:-translate-y-1'}`}>
                  {submitting ? 'Processing...' : 'Post IT Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ItJobPortal;
