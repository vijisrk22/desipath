import React, { useState, useEffect } from 'react';
import { FiShield, FiEyeOff, FiCheckCircle, FiMic, FiActivity, FiUsers, FiVideo, FiArrowRight, FiSearch, FiUserPlus, FiInbox } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import api from '../../utils/api';

const highlights = [
  {
    icon: <FiEyeOff className="w-8 h-8 text-blue-500" />,
    title: "Privacy-First",
    description: "Identity is private until both parties consent. Photos and personal details hidden by default."
  },
  {
    icon: <FiShield className="w-8 h-8 text-indigo-500" />,
    title: "Consent-Gated",
    description: "Mutual acceptance is required before any profile information is progressively unlocked."
  },
  {
    icon: <FiCheckCircle className="w-8 h-8 text-green-500" />,
    title: "NRI-Verified",
    description: "Trust built on real data. Residency tier and immigration status verification."
  },
  {
    icon: <FiMic className="w-8 h-8 text-purple-500" />,
    title: "Voice-First Intros",
    description: "Hear their voice first. A 30-second voice note introduction before photo unlock."
  },
  {
    icon: <FiActivity className="w-8 h-8 text-orange-500" />,
    title: "AI Compatibility",
    description: "Matches driven by deep values-based scoring, not just surface-level photos."
  },
  {
    icon: <FiUsers className="w-8 h-8 text-teal-500" />,
    title: "Family Circle",
    description: "Optional read-only family portal for parental involvement and shared decision making."
  }
];

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
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mt-8">
              Desi SecureMatch
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl">
              The Privacy-First Matrimonial Network for Global NRIs. Identity hidden by default, unlocked only by mutual consent.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/dating/post" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                <FiUserPlus className="w-5 h-5" /> {hasProfile ? 'View/Edit Profile' : 'Add Profile'}
              </Link>
              <Link to="/dating/search" className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center gap-2">
                <FiSearch className="w-5 h-5" /> Search Profiles
              </Link>
              {hasProfile && (
                <Link to="/dating/inbox" className="bg-purple-100 text-purple-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-200 transition shadow-lg flex items-center gap-2">
                  <FiInbox className="w-5 h-5" /> View Interests {interestCount > 0 && `(${interestCount})`}
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            {/* Decorative Element */}
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute inset-0 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center h-full gap-4">
                <FiShield className="w-24 h-24 text-white opacity-90" />
                <div className="text-xl font-bold text-white text-center">100% Privacy Guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Why SecureMatch?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Traditional platforms expose your identity by default. We invert the model. You are always in control of who sees what.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group">
              <div className="bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Ready to find your match securely?</h2>
          <p className="text-xl text-gray-600 mb-10">Sign up today and experience the revolutionary platform tailored for the global NRI community.</p>
          <Link to="/dating/post" className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            <FiUserPlus className="w-5 h-5" /> {hasProfile ? 'View/Edit Profile' : 'Create Anonymous Profile'}
          </Link>
        </div>
      </div>
      
      <Footer newsletter="block" hideOnMobile />
    </div>
  );
}
