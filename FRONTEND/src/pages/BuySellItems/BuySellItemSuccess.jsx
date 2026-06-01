import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const BuySellItemSuccess = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow bg-gray-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Success!</h1>
        <p className="text-gray-600 mb-8 text-lg">Your item has been posted successfully. It is now live on the marketplace.</p>
        
        <div className="space-y-4">
          <Link to="/buy-sell-items" className="block w-full bg-gradient-to-r from-[#0857d0] to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
            View Marketplace
          </Link>
          <Link to="/profile/myListings" className="block w-full bg-blue-50 hover:bg-blue-100 text-[#0857d0] font-bold py-3.5 px-4 rounded-xl border border-blue-200 transition-colors">
            Manage My Ads
          </Link>
        </div>
      </div>
      </div>
      <Footer newsletter={"block"} />
    </div>
  );
};

export default BuySellItemSuccess;
