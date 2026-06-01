import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const JobsLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Career Opportunities</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find local jobs, IT consulting roles, or request a referral. Choose a category below to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Job Referrals Card */}
            <div 
              onClick={() => navigate('/jobs/referrals')}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Job Referrals</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Connect with professionals for direct company referrals. Post an opening or request a referral.
              </p>
              <span className="text-[#0857d0] font-semibold group-hover:underline flex items-center">
                Explore Referrals 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </span>
            </div>

            {/* Blue Collar / Local Jobs Card */}
            <div 
              onClick={() => navigate('/jobs/local')}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Local Community Jobs</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Find local opportunities like nannies, elder care, cooks, grocery shop workers, and more.
              </p>
              <span className="text-green-600 font-semibold group-hover:underline flex items-center">
                Find Local Jobs 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </span>
            </div>

            {/* IT Jobs Card */}
            <div 
              onClick={() => navigate('/jobs/it')}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">IT Jobs</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Search IT jobs posted by consultancies. Filter by skills, location, Visa requirements, and H1B transfers.
              </p>
              <span className="text-purple-600 font-semibold group-hover:underline flex items-center">
                Explore IT Roles 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </span>
            </div>

          </div>
        </div>
      </div>
      <Footer newsletter="block" />
    </div>
  );
};

export default JobsLanding;
