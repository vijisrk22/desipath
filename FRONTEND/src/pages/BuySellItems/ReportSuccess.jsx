import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';

const ReportSuccess = () => {
  const location = useLocation();
  const title = location.state?.title || 'the listing';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Report Submitted Successfully</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for bringing <strong>{title}</strong> to our attention. Our moderation team will review this listing shortly. Your feedback helps keep our community safe and trusted.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/buy-sell-items" className="w-full bg-[#0857d0] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 hover:shadow-lg transition-all duration-200">
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
      <Footer newsletter={"block"} />
    </div>
  );
};

export default ReportSuccess;
