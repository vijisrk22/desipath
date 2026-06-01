import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

export default function PhotographySuccess() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-20 px-[7%]">
        <div className="max-w-xl w-full text-center">
          <div className="text-9xl mb-8 animate-bounce">📸</div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 font-dmsans">Listing Published!</h1>
          <p className="text-lg text-gray-500 mb-10 font-medium">
            Your professional photography profile is now live. Clients can discover you and view your showreel and packages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/services/photography" 
              className="px-8 py-3 bg-[#007185] text-white font-bold rounded-full hover:bg-[#005b6a] transition-all shadow-lg"
            >
              View Search Results
            </Link>
            <Link 
              to="/profile/myListings" 
              className="px-8 py-3 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-all"
            >
              Manage My Ads
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
