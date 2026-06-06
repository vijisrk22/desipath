import React from "react";
import { Link } from "react-router-dom";

function SellHomeCTA() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 md:py-12 mb-16">
      <div className="bg-gradient-to-r from-[#1565D8] to-[#0f4ca5] rounded-[32px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-32 h-32 bg-white opacity-10 rounded-full -mb-10 pointer-events-none" />

        <div className="relative z-10 md:w-2/3 mb-8 md:mb-0 text-center md:text-left">
          <h2 className="text-white text-3xl md:text-4xl font-bold font-dmsans tracking-tight mb-4">
            Selling Your Home?
          </h2>
          <p className="text-blue-100 text-lg font-medium font-dmsans max-w-xl">
            Reach thousands of buyers in the Desipath community. Post your listing for free and connect directly with interested families.
          </p>
        </div>

        <div className="relative z-10 md:w-1/3 flex justify-center md:justify-end">
          <Link
            to="/services/BuyHome/sellHouse"
            className="bg-white text-[#1565D8] hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 px-8 py-4 rounded-full font-bold font-dmsans text-lg shadow-lg whitespace-nowrap"
          >
            Post Home Listing Free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SellHomeCTA;
