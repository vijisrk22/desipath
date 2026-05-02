import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import { IoCheckmarkCircle, IoArrowBack, IoAddCircleOutline } from 'react-icons/io5';

export default function LocalAdSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-10 md:p-16 text-center border border-gray-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8 animate-bounce">
            <IoCheckmarkCircle size={56} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">Submission Successful!</h1>
          
          <div className="bg-green-50 text-green-800 p-6 rounded-3xl mb-10 border border-green-100 font-medium text-lg leading-relaxed">
            "Thanks for submitting your business Poster, Admin will review and approve it shortly"
          </div>
          
          <p className="text-gray-500 mb-12">
            You will receive an email notification once your advertisement is live in the marketplace. 
            You can track the status of your ads in your dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/services/Localdeals" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95"
            >
              <IoArrowBack size={20} />
              Browse Marketplace
            </Link>
            <Link 
              to="/services/Localdeals/post" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ffa41c] text-gray-900 font-bold rounded-2xl hover:bg-[#ff9900] transition-all active:scale-95 shadow-lg shadow-orange-100"
            >
              <IoAddCircleOutline size={20} />
              Post Another Ad
            </Link>
          </div>
        </div>
      </main>

      <Footer newsletter={"block"} />
    </div>
  );
}
