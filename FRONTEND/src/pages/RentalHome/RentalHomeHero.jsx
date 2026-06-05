import React from 'react';
import { useNavigate } from 'react-router-dom';

function RentalHomeHero() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#f4f7fb] py-12 lg:py-20 px-[5%] lg:px-[80px]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-[40px] lg:gap-[80px]">
        
        {/* Left Column - Content */}
        <div className="flex-1 max-w-[600px] flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-[36px] md:text-[48px] font-[700] text-gray-900 leading-[1.2] font-dmsans mb-[20px]">
            Find Your Next Rental Home
          </h1>
          <p className="text-[18px] md:text-[20px] leading-[1.5] text-gray-700 font-medium font-dmsans mb-[40px]">
            Browse apartments, houses, and shared rentals in your area.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-[16px] w-full lg:w-auto">
            {/* Primary CTA */}
            <button 
              onClick={() => navigate('findRentalHome')}
              className="w-full sm:w-auto min-w-[220px] h-[52px] sm:h-[56px] bg-[#1565D8] hover:bg-[#104eab] text-white text-[18px] font-bold rounded-full flex justify-center items-center gap-3 px-8 transition-all shadow-md group"
            >
              <span>Search Rental Homes</span>
              <div className="w-6 h-6 flex items-center justify-center overflow-hidden transition-transform group-hover:translate-x-1">
                <img src="/caretRight.png" alt="arrow" className="w-5 h-5" />
              </div>
            </button>

            {/* Secondary CTA */}
            <button 
              onClick={() => navigate('postRentalHome')}
              className="w-full sm:w-auto min-w-[220px] h-[52px] sm:h-[56px] bg-transparent hover:bg-[#eaf1fb] text-[#1565D8] border-2 border-[#1565D8] text-[18px] font-bold rounded-full flex justify-center items-center gap-3 px-8 transition-all group"
            >
              <span>Post Rental Listing</span>
              <div className="w-6 h-6 flex items-center justify-center overflow-hidden transition-transform group-hover:translate-x-1">
                <img 
                  src="/caretRight.png" 
                  alt="arrow" 
                  className="w-5 h-5" 
                  style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(87%) saturate(2250%) hue-rotate(205deg) brightness(93%) contrast(93%)' }} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="flex-1 flex justify-center lg:justify-end w-full mt-8 lg:mt-0">
          <img 
            src="/Desipath_RentHome.png" 
            alt="Modern Rental Home" 
            className="w-full max-w-[650px] aspect-[16/9] object-cover rounded-[24px] shadow-lg block"
          />
        </div>

      </div>
    </div>
  );
}

export default RentalHomeHero;
