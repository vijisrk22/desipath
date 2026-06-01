import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';
import JobReferralTermsModal from '../../components/Modals/JobReferralTermsModal';
import { useForm } from 'react-hook-form';

const JobReferralPortal = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'requesting_referral',
    company_name: '',
    role_title: '',
    description: '',
    resume_url: ''
  });

  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error("You must accept the terms and conditions.");
      return;
    }
    
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
    
    try {
      await api.post('/api/jobs/referrals', { ...formData, city, state, zipcode });
      toast.success("Referral posted successfully!");
      navigate('/jobs/referrals');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post referral.");
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
            <span onClick={() => navigate('/')} className="cursor-pointer hover:text-[#0857d0] hover:underline font-medium">Home</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-[#0857d0] hover:underline font-medium">Jobs</span>
            <span className="mx-2">&gt;</span>
            <span onClick={() => navigate('/jobs/referrals')} className="cursor-pointer hover:text-[#0857d0] hover:underline font-medium">Referrals</span>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-semibold">Post</span>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
              <h1 className="text-3xl font-extrabold">Post a Referral</h1>
              <p className="opacity-90 mt-2 text-lg">Request a referral or offer to refer someone to your company.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Post Type <span className="text-red-500">*</span></label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="radio" name="type" value="requesting_referral" checked={formData.type === 'requesting_referral'} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Requesting a Referral</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="type" value="offering_referral" checked={formData.type === 'offering_referral'} onChange={handleChange} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="ml-2 text-gray-700">Offering a Referral</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Company Name</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. Google, Meta" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Role Title</label>
                  <input type="text" name="role_title" value={formData.role_title} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="e.g. Software Engineer" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {formData.type === 'offering_referral' ? 'Job Posting Link' : 'Resume / LinkedIn URL'}
                </label>
                <input type="url" name="resume_url" value={formData.resume_url} onChange={handleChange} className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white px-4 py-2.5" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Location (Optional)</label>
                <LocationAutocompleteInput 
                  control={control} 
                  setValue={setValue} 
                  type="search" 
                  placeholder="City, State, Zip" 
                  className="w-full md:w-1/2 border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 bg-gray-50 focus-within:bg-white py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea 
                  required 
                  name="description" 
                  rows="5" 
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white px-4 py-2.5" 
                  placeholder={formData.type === 'offering_referral' 
                    ? "Describe about the openings, any other details about the job position and referral you are offering.." 
                    : "describe your experience, what openings you are looking for"}
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <button 
                      type="button" 
                      onClick={() => setIsTermsOpen(true)}
                      className="text-blue-600 hover:text-blue-800 font-bold underline focus:outline-none"
                    >
                      Disclaimer & Terms and Conditions
                    </button>
                    <span className="text-red-500 ml-1">*</span>
                  </span>
                </label>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={submitting || !termsAccepted} className={`w-full text-lg font-bold py-4 px-6 rounded-xl text-white shadow-xl transition-all duration-300 ${(submitting || !termsAccepted) ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-2xl hover:-translate-y-1'}`}>
                  {submitting ? 'Processing...' : 'Post Referral'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <JobReferralTermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};

export default JobReferralPortal;
