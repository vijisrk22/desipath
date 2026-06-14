import React, { useState, useEffect } from 'react';
import { 
  FiShield, FiCheckCircle, FiMic, FiActivity, FiUsers, FiVideo, 
  FiArrowRight, FiSearch, FiUserPlus, FiInbox, FiGlobe, FiAlertTriangle,
  FiLock, FiHeart, FiMessageCircle, FiImage, FiAward
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';

export default function DesiSecureMatchLanding() {
  const [hasProfile, setHasProfile] = useState(false);
  const [interestCount, setInterestCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      api.get('/api/sm/my-profile')
        .then(res => {
          if (res.data && res.data.id) {
            setHasProfile(true);
            api.get('/api/sm/interests/received')
              .then(intRes => {
                if (intRes.data) {
                  setInterestCount(intRes.data.length);
                }
              })
              .catch(() => {});
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <div className="bg-[#182A88] text-white py-24 px-4 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[80%] rounded-full bg-purple-600/20 blur-[120px]"></div>
          <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          {/* Left Side */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
              <FiShield className="text-purple-300" />
              <span className="text-sm font-medium tracking-wide text-blue-50">Privacy-first matchmaking for Global NRIs.</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Desi <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">SecureMatch</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Meet verified Indians worldwide. <br className="hidden lg:block"/>
              Your identity remains private until both sides choose to connect.
            </p>
            
            <div className="pt-4 flex flex-col gap-4 max-w-md mx-auto lg:mx-0">
              <label className="flex items-start gap-3 cursor-pointer text-left bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <input type="checkbox" id="age_disclaimer" className="mt-1 w-5 h-5 accent-purple-600 cursor-pointer" />
                <span className="text-sm text-blue-100 leading-snug">
                  I confirm that I am 18 years or older. I understand this is a secure dating and matrimonial platform. I agree to treat all members with respect and understand that my identity is verified to ensure community safety.
                </span>
              </label>
              
              <button 
                onClick={(e) => {
                  if(!document.getElementById('age_disclaimer').checked) {
                    e.preventDefault();
                    alert('Please accept the disclaimer to enter.');
                  } else {
                    window.location.href = '/dating/dashboard';
                  }
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-[20px] font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 w-full"
              >
                 Enter SecureMatch <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Right Side - Overlapping Cards */}
          <div className="flex-1 w-full flex justify-center lg:justify-end relative h-[500px] mt-10 lg:mt-0">
            {/* Card 1 */}
            <div className="absolute top-10 right-4 lg:right-0 w-72 bg-white/10 backdrop-blur-xl border border-white/30 p-5 rounded-[20px] shadow-2xl z-30 transform hover:-translate-y-2 transition-transform duration-500">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white/50 filter blur-[4px]">
                  <img src="https://i.pravatar.cc/150?u=priya" alt="Priya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-1">Priya S. <FiCheckCircle className="text-green-400 w-4 h-4" /></h3>
                  <p className="text-sm text-blue-100">29 • Dallas, Texas</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-white/90 flex items-center gap-2"><FiActivity className="w-4 h-4" /> Software Engineer</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Compatibility</span>
                <span className="text-green-300 font-bold">92%</span>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-md border border-green-500/30 flex items-center gap-1"><FiCheckCircle className="w-3 h-3" /> ID Verified</span>
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30 flex items-center gap-1"><FiCheckCircle className="w-3 h-3" /> Selfie Verified</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute top-32 right-12 lg:right-16 w-72 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[20px] shadow-xl z-20 scale-95 transform hover:-translate-y-2 transition-transform duration-500 opacity-90 hidden sm:block">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white/50 filter blur-[4px]">
                  <img src="https://i.pravatar.cc/150?u=rahul" alt="Rahul" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rahul K.</h3>
                  <p className="text-sm text-blue-100">31 • Toronto, Canada</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-white/90 flex items-center gap-2"><FiActivity className="w-4 h-4" /> Product Manager</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Compatibility</span>
                <span className="text-green-300 font-bold">88%</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="absolute top-52 right-0 lg:-right-8 w-72 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[20px] shadow-xl z-10 scale-90 transform hover:-translate-y-2 transition-transform duration-500 opacity-80 hidden md:block">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 overflow-hidden border-2 border-white/50 filter blur-[4px]">
                  <img src="https://i.pravatar.cc/150?u=ananya" alt="Ananya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ananya R.</h3>
                  <p className="text-sm text-blue-100">28 • London, UK</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-white/90 flex items-center gap-2"><FiActivity className="w-4 h-4" /> Doctor</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-white">Compatibility</span>
                <span className="text-green-300 font-bold">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST STRIP */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <FiCheckCircle className="w-6 h-6 text-green-500" />, title: "Verified Profiles", desc: "Identity and selfie verification" },
            { icon: <FiShield className="w-6 h-6 text-blue-500" />, title: "Privacy First", desc: "Identity hidden by default" },
            { icon: <FiAlertTriangle className="w-6 h-6 text-orange-500" />, title: "AI Scam Detection", desc: "Fraud prevention and moderation" },
            { icon: <FiGlobe className="w-6 h-6 text-purple-500" />, title: "Global Community", desc: "Indians in 40+ countries" }
          ].map((trust, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-6 shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow">
              <div className="bg-gray-50 p-3 rounded-full">{trust.icon}</div>
              <div>
                <h4 className="font-bold text-gray-900">{trust.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{trust.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATISTICS SECTION */}
      <div className="pt-24 pb-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { num: "50,000+", label: "Verified Members" },
              { num: "40+", label: "Countries" },
              { num: "95%", label: "Verified Profiles" },
              { num: "2,800+", label: "Successful Matches" }
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-4xl lg:text-5xl font-extrabold text-[#182A88]">{stat.num}</div>
                <div className="text-gray-600 font-medium tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHY DESI SECUREMATCH */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900">Why Desi SecureMatch?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Traditional dating platforms expose identities by default. <br />
              Desi SecureMatch puts privacy and trust first.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: <FiLock className="w-8 h-8 text-[#182A88]" />, title: "Privacy First", desc: "Identity remains hidden until mutual consent." },
              { icon: <FiCheckCircle className="w-8 h-8 text-green-600" />, title: "Verified Members", desc: "ID and selfie verification reduce fake profiles." },
              { icon: <FiActivity className="w-8 h-8 text-purple-600" />, title: "AI Safety", desc: "Advanced fraud and scam detection." },
              { icon: <FiUsers className="w-8 h-8 text-pink-600" />, title: "Family Mode", desc: "Optional parent-assisted matchmaking." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-[20px] p-10 border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-16">How it Works</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-purple-200 -z-10 -translate-y-1/2"></div>
            
            {[
              { step: 1, title: "Create Profile", icon: <FiUserPlus /> },
              { step: 2, title: "Get Verified", icon: <FiCheckCircle /> },
              { step: 3, title: "Discover Matches", icon: <FiSearch /> },
              { step: 4, title: "Mutual Interest", icon: <FiHeart /> },
              { step: 5, title: "Secure Chat", icon: <FiMessageCircle /> },
              { step: 6, title: "Video Date", icon: <FiVideo /> }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center mb-10 md:mb-0 relative px-2 z-10 bg-gray-50">
                <div className="w-16 h-16 rounded-full bg-white shadow-md border-2 border-purple-100 flex items-center justify-center text-[#182A88] text-2xl mb-4 font-bold relative group hover:scale-110 transition-transform">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold shadow-sm">
                    {item.step}
                  </div>
                </div>
                <div className="font-bold text-gray-900">{item.title}</div>
                {/* Mobile connector */}
                {idx < 5 && <div className="md:hidden h-8 border-l-2 border-dashed border-purple-300 my-2"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREMIUM FEATURES */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Premium Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Elevate your experience with specialized tools designed for authentic connections.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI Matchmaker", desc: "Daily curated recommendations based on compatibility.", icon: <FiActivity /> },
              { title: "Voice Introductions", desc: "30-second voice introductions.", icon: <FiMic /> },
              { title: "Private Photos", desc: "Photo access controlled by users.", icon: <FiImage /> },
              { title: "Immigration Filters", desc: "H1B, Green Card, PR Canada, UK Visa, OCI, Citizen.", icon: <FiGlobe /> },
              { title: "Video Dates", desc: "Secure in-app video calls.", icon: <FiVideo /> },
              { title: "Family Mode", desc: "Parents can suggest matches without accessing chats.", icon: <FiUsers /> }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-2xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-600">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUCCESS STORIES */}
      <div className="py-24 bg-[#182A88] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-purple-900/30 blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/20 blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4">Success Stories</h2>
            <p className="text-blue-200 text-lg">Real connections made possible by privacy and trust.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=600&q=80", names: "Ananya & Karthik", loc: "New Jersey", how: "Met on Desi SecureMatch", outcome: "Married in 2025" },
              { img: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=600&q=80", names: "Sneha & Arjun", loc: "Toronto", how: "Found through AI Matchmaker", outcome: "Engaged in 2026" },
              { img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80", names: "Priya & Rohit", loc: "Dallas", how: "Matched through mutual interests", outcome: "Married in 2025" }
            ].map((story, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md rounded-[20px] overflow-hidden border border-white/20 hover:-translate-y-2 transition-transform duration-300">
                <div className="h-48 bg-gray-300 relative">
                  <img src={story.img} alt="Couple" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#182A88]/90 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-bold">{story.names}</h3>
                    <p className="text-sm text-blue-200">{story.loc}</p>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-blue-50">
                    <div className="bg-white/20 p-2 rounded-full"><FiHeart className="text-pink-300" /></div>
                    <span>{story.how}</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-50">
                    <div className="bg-white/20 p-2 rounded-full"><FiAward className="text-yellow-300" /></div>
                    <span className="font-bold">{story.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SAFETY SECTION */}
      <div className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Designed for Trust and Privacy</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "Identity Hidden", "Mutual Consent Required", "AI Scam Detection",
              "Report and Block", "Photo Approval System", "Encrypted Messaging"
            ].map((badge, idx) => (
              <div key={idx} className="bg-gray-50 rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:border-purple-200 transition-all duration-300">
                <div className="bg-green-100 p-4 rounded-full">
                  <FiShield className="w-8 h-8 text-green-600" />
                </div>
                <span className="font-bold text-gray-800">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="bg-gradient-to-br from-[#182A88] to-indigo-900 py-24 px-4 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Ready to find meaningful connections?</h2>
          <p className="text-xl text-blue-100">Join thousands of verified Indians across the world.</p>
          <div className="flex flex-col gap-4 max-w-md mx-auto pt-4">
            <label className="flex items-start gap-3 cursor-pointer text-left bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition">
              <input type="checkbox" id="age_disclaimer_bottom" className="mt-1 w-5 h-5 accent-purple-600 cursor-pointer" />
              <span className="text-sm text-blue-100 leading-snug">
                I confirm that I am 18 years or older. I understand this is a secure dating and matrimonial platform. I agree to treat all members with respect and understand that my identity is verified to ensure community safety.
              </span>
            </label>
            
            <button 
              onClick={(e) => {
                if(!document.getElementById('age_disclaimer_bottom').checked) {
                  e.preventDefault();
                  alert('Please accept the disclaimer to enter.');
                } else {
                  window.location.href = '/dating/dashboard';
                }
              }}
              className="bg-white text-[#182A88] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 w-full"
            >
               Enter SecureMatch <FiArrowRight />
            </button>
          </div>
        </div>
      </div>
      
      <Footer newsletter="block" hideOnMobile />
    </div>
  );
}
