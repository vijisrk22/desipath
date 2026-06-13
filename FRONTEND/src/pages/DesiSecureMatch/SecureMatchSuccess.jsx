import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiSearch } from 'react-icons/fi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import DisplayPath from '../../components/DisplayPath';

export default function SecureMatchSuccess() {
  const navigate = useNavigate();

  const paths = [
    { text: 'Home', eP: '/' },
    { text: 'SecureMatch', eP: '/dating' },
    { text: 'Success', eP: '#' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 max-w-4xl mx-auto w-full">
        <div className="w-full mb-6 -mt-6">
          <DisplayPath paths={paths} color="gray-500" additionalStyles="hover:text-indigo-600 transition" />
        </div>
        
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center max-w-2xl w-full">
          <div className="mb-8 flex justify-center">
            <div className="bg-green-100 text-green-600 p-6 rounded-full animate-bounce">
              <FiCheckCircle className="w-16 h-16" />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Profile Created Successfully!</h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Your anonymous profile is now live. Your identity remains hidden and will only be revealed upon mutual consent.
          </p>
          
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-10 text-left">
            <h3 className="font-bold text-indigo-900 mb-2">What happens next?</h3>
            <ul className="list-disc list-inside text-indigo-800 space-y-2">
              <li>Browse other anonymous profiles in the Secure Match Feed.</li>
              <li>Send an interest if you find a compatible match.</li>
              <li>When they accept, Step 1 of the mutual unlock begins.</li>
            </ul>
          </div>

          <button 
            onClick={() => navigate('/dating/search')}
            className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-3 hover:bg-indigo-700 transition shadow-lg"
          >
            <FiSearch className="w-6 h-6" /> Start Searching Profiles
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
