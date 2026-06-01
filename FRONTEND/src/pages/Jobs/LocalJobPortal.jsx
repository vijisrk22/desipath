import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';
import { useForm } from 'react-hook-form';

const LOCAL_JOB_CATEGORIES = [
  "Nanny / Babysitter",
  "Elder Care",
  "Cook / Chef",
  "Grocery Store Worker",
  "House Cleaning",
  "Driver",
  "Handyman",
  "Other"
];

const LocalJobPortal = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    pay_rate: ''
  });

  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (!city || !state || !zipcode) {
      toast.error("Please select a valid location with City, State, and Zip code.");
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/api/jobs/local', { ...formData, city, state, zipcode });
      toast.success("Local Job posted successfully!");
      navigate('/jobs/local');
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-sm text-gray-500 mb-6 flex items-center">
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-green-600 hover:underline font-medium">Home</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-green-600 hover:underline font-medium">Jobs</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs/local')} className="cursor-pointer hover:text-green-600 hover:underline font-medium">Local Jobs</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-semibold">Post</span>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white p-8">
              <h1 className="text-3xl font-extrabold">Post a Local Job</h1>
              <p className="opacity-90 mt-2 text-lg">Hire a nanny, cook, or local helper.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Job Title <span className="text-red-500">*</span></label>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. Seeking experienced Nanny" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select required name="category" value={formData.category} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white px-4 py-2.5">
                    <option value="">Select a category</option>
                    {LOCAL_JOB_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <LocationAutocompleteInput 
                  control={control} 
                  setValue={setValue} 
                  type="search" 
                  placeholder="City, State, Zip" 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 bg-gray-50 focus-within:bg-white py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Pay Rate (Optional)</label>
                <input type="text" name="pay_rate" value={formData.pay_rate} onChange={handleChange} className="w-full md:w-1/2 border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. $15/hr or Negotiable" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea required name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="Describe the job requirements, schedule, etc..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={submitting} className={`w-full text-lg font-bold py-4 px-6 rounded-xl text-white shadow-xl transition-all duration-300 ${submitting ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-700 hover:shadow-2xl hover:-translate-y-1'}`}>
                  {submitting ? 'Processing...' : 'Post Job'}
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

export default LocalJobPortal;
