import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { CircularProgress } from "@mui/material";
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';
import LocalJobDetailsModal from '../../components/Modals/LocalJobDetailsModal';
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

const LocalJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  
  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [category, locationValue]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `/api/jobs/local?`;
      if (category) url += `category=${encodeURIComponent(category)}&`;
      
      let zipcode = '';
      if (locationValue) {
        const parts = locationValue.split(',').map(p => p.trim());
        const lastPart = parts[parts.length - 1];
        if (/\d/.test(lastPart)) zipcode = lastPart;
      }
      if (zipcode) url += `zipcode=${zipcode}`;

      const response = await api.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        
        {/* Hero Section */}
        <div className="bg-[#0857d0] text-white pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb & Top Actions */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-blue-200 hidden md:flex items-center">
                <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white hover:underline font-medium">Home</span>
                <span className="mx-2">&gt;</span>
                <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-white hover:underline font-medium">Jobs</span>
                <span className="mx-2">&gt;</span>
                <span className="text-white font-semibold">Local Community Jobs</span>
              </div>
              <button 
                onClick={() => navigate('/jobs/local/post')}
                className="bg-white text-[#0857d0] px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all shadow-md hover:shadow-lg inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Post a Job
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              
              <div className="text-center md:text-left shrink-0">
                <h1 className="text-3xl font-bold mb-2">Local Community Jobs</h1>
                <p className="text-lg text-blue-100">Find blue-collar jobs in your neighborhood.</p>
              </div>

              {/* Search Filters Inline in Hero */}
              <div className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20 grow max-w-3xl">
                <div className="flex-1 w-full text-gray-900">
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 border-none px-4 py-3 appearance-none h-[48px]"
                  >
                    <option value="">All Categories</option>
                    {LOCAL_JOB_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 w-full text-gray-900">
                  <LocationAutocompleteInput 
                    control={control} 
                    setValue={setValue} 
                    type="search"
                    placeholder="City, State, Zip" 
                    className="w-full bg-white rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-blue-300 border-none px-2 !py-3 h-[48px]"
                  />
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button 
                    onClick={() => fetchJobs()}
                    className="w-full md:w-auto bg-[#0857d0] hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg h-[48px] flex items-center justify-center"
                  >
                    Search
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {loading ? (
            <div className="flex justify-center py-20"><CircularProgress /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No local jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                      {job.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-500 text-sm font-medium mb-3">
                    📍 {[job.city, job.state, job.zipcode].filter(Boolean).join(', ')}
                  </p>
                  
                  {job.pay_rate && (
                    <p className="text-green-700 font-bold mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      {job.pay_rate}
                    </p>
                  )}
                  
                  <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{job.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        {job.user?.profile_photo ? (
                          <img src={job.user.profile_photo.startsWith('http') ? job.user.profile_photo : `http://localhost:8000${job.user.profile_photo}`} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                            {job.user?.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-[120px]">{job.user?.name || 'User'}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const chatInfo = encodeURIComponent(JSON.stringify({ 
                          chatPartnerId: job.user_id,
                          chatPartnerName: job.user?.name || "User"
                        }));
                        const initialMessage = encodeURIComponent(`I am interested in the job ${job.title} - ${[job.city, job.state, job.zipcode].filter(Boolean).join(', ')}`);
                        navigate(`/inbox?chatPartnerInfo=${chatInfo}&initialMessage=${initialMessage}&adId=${job.id}&adType=localjob`);
                      }}
                      className="text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      
      <LocalJobDetailsModal 
        isOpen={!!selectedJob} 
        job={selectedJob} 
        onClose={() => setSelectedJob(null)} 
      />

      <Footer />
    </div>
  );
};

export default LocalJobs;
