import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const JobsLanding = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />
      <div className="flex-grow">
        
        {/* Colorful Elegant Hero Section */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 pt-24 pb-32 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] rounded-full bg-purple-500 opacity-20 blur-3xl mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-blue-400 opacity-20 blur-3xl mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-[30%] left-[30%] w-[30%] h-[40%] rounded-full bg-pink-500 opacity-10 blur-3xl mix-blend-screen"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200 mb-6 drop-shadow-sm tracking-tight">
              Unlock Your Career Potential
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
              Whether you're looking for global IT roles, local community opportunities, or insider company referrals—your next step starts here.
            </p>
          </div>
          
          {/* Wavy Divider */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.85,130.22,201.3,116.7,243.6,108.57,284.4,85.2,321.39,56.44Z" fill="#f8fafc"></path>
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Job Referrals Card */}
            <div 
              onClick={() => navigate('/jobs/referrals')}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 cursor-pointer hover:-translate-y-4 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group flex flex-col relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 shadow-inner transition-transform duration-500">
                <svg className="w-10 h-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">Job Referrals</h2>
              <p className="text-slate-500 mb-8 flex-grow leading-relaxed text-lg">
                Connect with industry insiders for direct company referrals. Bypass the queue and land your dream job faster.
              </p>
              <div className="flex items-center">
                <span className="text-blue-600 font-bold bg-blue-50 px-5 py-2.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center">
                  Explore Referrals 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </div>
            </div>

            {/* Blue Collar / Local Jobs Card */}
            <div 
              onClick={() => navigate('/jobs/local')}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 cursor-pointer hover:-translate-y-4 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-green-600"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 shadow-inner transition-transform duration-500">
                <svg className="w-10 h-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 group-hover:text-emerald-600 transition-colors">Local Community</h2>
              <p className="text-slate-500 mb-8 flex-grow leading-relaxed text-lg">
                Discover local opportunities like nannies, elder care, cooks, and retail staff in your neighborhood.
              </p>
              <div className="flex items-center">
                <span className="text-emerald-600 font-bold bg-emerald-50 px-5 py-2.5 rounded-full group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center">
                  Find Local Jobs 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </div>
            </div>

            {/* IT Jobs Card */}
            <div 
              onClick={() => navigate('/jobs/it')}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 cursor-pointer hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-purple-700"></div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 shadow-inner transition-transform duration-500">
                <svg className="w-10 h-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 group-hover:text-purple-600 transition-colors">IT Consulting</h2>
              <p className="text-slate-500 mb-8 flex-grow leading-relaxed text-lg">
                Search high-paying IT jobs posted by top consultancies. Filter easily by skills, Visa, and H1B options.
              </p>
              <div className="flex items-center">
                <span className="text-purple-600 font-bold bg-purple-50 px-5 py-2.5 rounded-full group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center">
                  Explore IT Roles 
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer newsletter="block" />
    </div>
  );
};

export default JobsLanding;
