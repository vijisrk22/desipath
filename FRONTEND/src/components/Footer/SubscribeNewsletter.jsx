import React, { useState } from 'react';

function SubscribeNewsletter() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10 border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 -mb-16">
      {/* Left Side: Text */}
      <div className="flex-1 text-center md:text-left flex flex-col gap-2">
        <h3 className="text-[20px] md:text-[24px] font-[700] text-gray-900 font-dmsans">
          Stay Connected with Desipath
        </h3>
        <p className="text-[15px] text-gray-600 font-medium font-dmsans leading-relaxed max-w-[500px]">
          Get updates on local events, rentals, jobs, rideshares, classifieds, and community news.
        </p>
      </div>

      {/* Right Side: Input + Button */}
      <div className="w-full md:w-auto flex-1 max-w-[500px]">
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-stretch gap-3">
          <div className="flex-grow flex items-center bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] px-4 py-3 focus-within:ring-2 focus-within:ring-[#1565D8]/20 focus-within:border-[#1565D8] transition-all">
            <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              required
              className="w-full bg-transparent text-gray-900 text-[15px] font-medium font-dmsans outline-none placeholder:text-gray-400"
              placeholder="Enter your email address"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="shrink-0 h-[52px] px-8 bg-[#1565D8] hover:bg-[#104eab] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed rounded-xl text-white text-[16px] font-bold font-dmsans transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubscribeNewsletter;
