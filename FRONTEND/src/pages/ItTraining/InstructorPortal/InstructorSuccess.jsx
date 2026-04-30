import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

export default function ItInstructorSuccess() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-dmsans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl shadow-blue-900/10 p-10 md:p-16 text-center border border-gray-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
            ✅
          </div>
          <h1 className="text-4xl font-black text-blue-900 mb-4">Program Submitted!</h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed font-medium">
            Your technical training program has been successfully submitted for review. Our team will verify the details and publish it to the marketplace within 24-48 hours.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/it-training"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1"
            >
              Back to Marketplace
            </Link>
            <Link 
              to="/profile/myListings"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-900 border-2 border-blue-100 font-bold rounded-2xl transition-all hover:-translate-y-1"
            >
              View My Listings
            </Link>
          </div>
        </div>
      </div>
      <Footer newsletter={"block"} />
    </div>
  );
}
