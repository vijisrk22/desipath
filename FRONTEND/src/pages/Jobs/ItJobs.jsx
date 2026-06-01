import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { CircularProgress, Drawer, IconButton } from "@mui/material";
import LocationAutocompleteInput from '../../components/InputTemplate/LocationAutocompleteInput';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';

const ItJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { control, setValue, watch } = useForm();
  const locationValue = watch('location');
  
  const [skillsFilter, setSkillsFilter] = useState('');
  const [h1bFilter, setH1bFilter] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [locationValue, h1bFilter]);

  const handleSkillsBlur = () => fetchJobs();
  const handleSkillsKeyDown = (e) => {
    if (e.key === 'Enter') fetchJobs();
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = `/api/jobs/it?`;
      
      let zipcode = '';
      if (locationValue) {
        const parts = locationValue.split(',').map(p => p.trim());
        const lastPart = parts[parts.length - 1];
        if (/\d/.test(lastPart)) zipcode = lastPart;
      }
      if (zipcode) url += `zipcode=${zipcode}&`;
      if (h1bFilter) url += `h1b_transfer_available=true&`;
      if (skillsFilter) url += `skills=${encodeURIComponent(skillsFilter)}&`;

      const response = await api.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch IT jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJob = (job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow">
        
        {/* Hero Section */}
        <div className="bg-[#0857d0] text-white pt-8 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <div className="text-sm text-blue-200 mb-4 flex items-center">
              <span onClick={() => navigate('/')} className="cursor-pointer hover:text-white hover:underline font-medium">Home</span>
              <span className="mx-2">&gt;</span>
              <span onClick={() => navigate('/jobs')} className="cursor-pointer hover:text-white hover:underline font-medium">Jobs</span>
              <span className="mx-2">&gt;</span>
              <span className="text-white font-semibold">IT Jobs</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="text-center md:text-left w-full md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">IT Jobs</h1>
                <p className="text-lg text-blue-100">Find IT roles posted by top consultancies.</p>
              </div>

              <div className="flex-shrink-0 mt-4 md:mt-0 self-center md:self-auto">
                <button 
                  onClick={() => navigate('/jobs/it/post')}
                  className="bg-white text-[#0857d0] px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Post IT Job
                </button>
              </div>
            </div>

            {/* Search Filters Inline in Hero */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <div className="flex-1 w-full text-gray-900">
                <input 
                  type="text" 
                  value={skillsFilter} 
                  onChange={(e) => setSkillsFilter(e.target.value)}
                  onBlur={handleSkillsBlur}
                  onKeyDown={handleSkillsKeyDown}
                  placeholder="Search Skills (e.g. React, Java)..."
                  className="w-full bg-white rounded-lg shadow-inner focus:ring-2 focus:ring-blue-300 border-none px-4 py-3"
                />
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
              <div className="flex-none w-full md:w-auto text-white">
                <label className="flex items-center cursor-pointer bg-white/20 hover:bg-white/30 transition-colors px-4 py-3 border border-white/30 rounded-lg">
                  <input 
                    type="checkbox" 
                    checked={h1bFilter}
                    onChange={(e) => setH1bFilter(e.target.checked)}
                    className="w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 font-bold whitespace-nowrap">H1B Transfer Only</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {loading ? (
            <div className="flex justify-center py-20"><CircularProgress /></div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No IT jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => handleOpenJob(job)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer"
                >
                  <div className="flex-1 pr-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-purple-700 font-bold mb-1">{job.company_name}</p>
                    <p className="text-gray-500 text-sm font-medium mb-4">
                      📍 {job.city || job.state || job.zipcode ? [job.city, job.state, job.zipcode].filter(Boolean).join(', ') : 'Remote / Nationwide'}
                    </p>
                    
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-700">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 text-xs font-bold rounded bg-gray-100 text-gray-500">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                  </div>

                  <div className="flex-shrink-0 md:w-64 flex flex-col justify-between md:border-l md:border-gray-100 md:pl-6 mt-6 md:mt-0">
                    <div>
                      {job.job_types && job.job_types.length > 0 && (
                        <div className="mb-3">
                          <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Job Types</div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {job.job_types.join(', ')}
                          </div>
                        </div>
                      )}
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Visa Statuses</div>
                      {job.visa_requirements && job.visa_requirements.length > 0 ? (
                        <div className="font-semibold text-gray-800 text-sm">
                          {job.visa_requirements.join(', ')}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">Not specified</div>
                      )}
                      {job.h1b_transfer_available && (
                        <div className="mt-2 text-xs font-bold text-green-700 bg-green-100 inline-block px-2 py-0.5 rounded">
                          ✅ H1B Transfer
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium mt-4 md:mt-0 text-right">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />

      {/* Drawer for Job Details */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400, md: 500 } } }}
      >
        {selectedJob && (
          <div className="h-full flex flex-col bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
              <IconButton onClick={handleCloseDrawer} size="small">
                <CloseIcon />
              </IconButton>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{selectedJob.title}</h1>
              <p className="text-purple-700 text-lg font-bold mb-2">{selectedJob.company_name}</p>
              <p className="text-gray-500 font-medium mb-6 flex items-center">
                📍 {selectedJob.city || selectedJob.state || selectedJob.zipcode ? [selectedJob.city, selectedJob.state, selectedJob.zipcode].filter(Boolean).join(', ') : 'Remote / Nationwide'}
              </p>

              <div className="bg-purple-50 rounded-xl p-5 mb-8 border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-3 border-b border-purple-200 pb-2">Requirements & Details</h3>
                
                {selectedJob.job_types && selectedJob.job_types.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Job Types</span>
                    <span className="font-semibold text-gray-800">{selectedJob.job_types.join(', ')}</span>
                  </div>
                )}
                
                <div className="mb-3">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">Visa Statuses</span>
                  {selectedJob.visa_requirements && selectedJob.visa_requirements.length > 0 ? (
                    <span className="font-semibold text-gray-800">{selectedJob.visa_requirements.join(', ')}</span>
                  ) : (
                    <span className="text-gray-500 italic">Not specified</span>
                  )}
                </div>

                {selectedJob.h1b_transfer_available && (
                  <div className="text-sm font-bold text-green-700 bg-green-100 inline-block px-3 py-1 rounded-full">
                    ✅ H1B Transfer Available
                  </div>
                )}
              </div>

              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1.5 text-sm font-bold rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Description</h3>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Posted By</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    {selectedJob.user?.profile_photo ? (
                      <img src={selectedJob.user.profile_photo.startsWith('http') ? selectedJob.user.profile_photo : `http://localhost:8000${selectedJob.user.profile_photo}`} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xl">
                        {selectedJob.user?.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">{selectedJob.user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 font-medium">Posted on {new Date(selectedJob.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  const chatInfo = encodeURIComponent(JSON.stringify({ 
                    chatPartnerId: selectedJob.user_id,
                    chatPartnerName: selectedJob.user?.name || "User"
                  }));
                  const initialMessage = encodeURIComponent(`I am interested in the IT job ${selectedJob.title} at ${selectedJob.company_name}`);
                  navigate(`/inbox?chatPartnerInfo=${chatInfo}&initialMessage=${initialMessage}&adId=${selectedJob.id}&adType=itjob`);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-colors flex justify-center items-center"
              >
                Message Poster
              </button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ItJobs;
