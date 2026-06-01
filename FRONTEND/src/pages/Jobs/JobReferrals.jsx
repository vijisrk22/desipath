import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { CircularProgress } from "@mui/material";

const JobReferrals = () => {
  const navigate = useNavigate();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // 'requesting_referral' or 'offering_referral' or ''

  useEffect(() => {
    fetchReferrals();
  }, [filter]);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const url = filter ? `/api/jobs/referrals?type=${filter}` : `/api/jobs/referrals`;
      const response = await api.get(url);
      setReferrals(response.data);
    } catch (error) {
      console.error("Failed to fetch referrals", error);
    } finally {
      setLoading(false);
    }
  };

  const startChat = (userId) => {
    // Basic redirection to the inbox with a selected user
    // Since the system uses `/inbox` (Chat component), we will pass the user data or just rely on standard flow.
    navigate(`/inbox?userId=${userId}`);
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
              <span className="text-white font-semibold">Job Referrals</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-4 md:mb-0 w-full md:w-1/2">
                <h1 className="text-3xl font-bold mb-2">Job Referrals</h1>
                <p className="text-lg text-blue-100 mb-4">Connect with peers to give or get referrals.</p>
              </div>

              <div className="flex-shrink-0 mt-4 md:mt-0">
                <button 
                  onClick={() => navigate('/jobs/referrals/post')}
                  className="bg-white text-[#0857d0] px-6 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Post Referral
                </button>
              </div>
            </div>

          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          <div className="mb-6 flex space-x-2">
            <button 
              onClick={() => setFilter('')} 
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === '' ? 'bg-[#0857d0] text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              All Posts
            </button>
            <button 
              onClick={() => setFilter('requesting_referral')} 
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'requesting_referral' ? 'bg-[#0857d0] text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Requests
            </button>
            <button 
              onClick={() => setFilter('offering_referral')} 
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${filter === 'offering_referral' ? 'bg-[#0857d0] text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
            >
              Offers
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><CircularProgress /></div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-lg">No referrals found.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              {referrals.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row gap-6 hover:shadow-md transition-all duration-200">
                  
                  {/* Left Column: User Info & Badge */}
                  <div className="md:w-1/4 flex flex-col items-start md:border-r md:border-gray-100 md:pr-6 shrink-0">
                    <div className="flex items-center w-full mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                        {job.user?.profile_photo ? (
                          <img src={job.user.profile_photo.startsWith('http') ? job.user.profile_photo : `http://localhost:8000${job.user.profile_photo}`} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span>{job.user?.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div className="ml-3 overflow-hidden">
                        <span className="block text-sm font-bold text-gray-900 truncate">{job.user?.name || 'User'}</span>
                        <span className="block text-xs text-gray-500">{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${job.type === 'requesting_referral' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                      {job.type === 'requesting_referral' ? 'Requesting Referral' : 'Offering Referral'}
                    </span>
                  </div>
                  
                  {/* Middle Column: Job Details */}
                  <div className="md:w-2/4 flex flex-col grow">
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">{job.role_title || 'General Role'}</h3>
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-sm">{job.company_name || 'Any Company'}</span>
                      {(job.city || job.state || job.zipcode) && (
                        <span className="text-gray-500 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {[job.city, job.state, job.zipcode].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm flex-grow leading-relaxed line-clamp-3">{job.description}</p>
                    
                    {job.resume_url && (
                      <div className="mt-3">
                        <a href={job.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center group">
                          {job.type === 'offering_referral' ? 'View Job Details' : 'View Resume / Profile'}
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Column: Action */}
                  <div className="md:w-1/4 flex flex-col items-center justify-center md:border-l md:border-gray-100 md:pl-6 mt-4 md:mt-0 shrink-0">
                    <button 
                      onClick={() => startChat(job.user_id)}
                      className="w-full bg-[#0857d0] hover:bg-blue-800 text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                      Message
                    </button>
                  </div>
                  
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobReferrals;
