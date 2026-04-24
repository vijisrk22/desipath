import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';

export default function InstructorSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-dmsans">
      <Navbar />
      
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-16 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 p-12 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
            🎉
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Thank You for Submitting!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Your class listing has been successfully saved. Our Admin team will review your information shortly. We will contact you at your registered email address with the final status before your listing goes live!
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/kids-class"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5"
            >
              Return to Kids Class Home
            </Link>
            <div className="block">
              <Link 
                to="/"
                className="text-blue-600 font-semibold hover:underline"
              >
                Go to Desipath Homepage
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <div className="mt-8">
        <Footer newsletter={"block"} />
      </div>
    </div>
  );
}
