import React from 'react';
import { Link } from 'react-router-dom';
import { IoCheckmarkCircle, IoPersonOutline } from 'react-icons/io5';

export default function ProfileSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-dmsans animate-fadeIn">
      <div className="max-w-xl w-full bg-white rounded-[40px] shadow-xl shadow-gray-100 p-8 md:p-12 text-center border border-gray-100">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 text-blue-600 rounded-full mb-8 animate-bounce">
          <IoCheckmarkCircle size={56} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">Profile Updated!</h1>
        
        <div className="bg-blue-50 text-blue-800 p-6 rounded-3xl mb-10 border border-blue-100 font-medium text-lg leading-relaxed">
          "Your profile has been updated successfully."
        </div>
        
        <p className="text-gray-500 mb-12">
          Your changes are now live. You can continue browsing the community or check your updated profile.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/profile" 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
          >
            <IoPersonOutline size={20} />
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
