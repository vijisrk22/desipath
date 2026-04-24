import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function HouseCard({ house }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate total baths
  const totalBaths = (house.full_bathroom_total || 0) + (house.half_bathroom_total || 0);
  return (
    <Link
      to={`/services/houses/buyHouse/${house.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full"
    >
      {/* Image Section */}
      <div className="relative h-56 lg:h-64 overflow-hidden">
        <img
          src={house.images && house.images.length > 0
            ? `https://desipathapi.azurewebsites.net/${house.images[0]}`
            : "/homesSmpl.png"}
          alt={house.home_type}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#cc4b1f] text-white text-[11px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-sm">
            {house.user_type === 'Agent' ? 'Agent Listing' : 'Active'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorited(!isFavorited);
          }}
          className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md hover:bg-black/40 rounded-full transition-all duration-300 transform group-hover:scale-110"
        >
          {isFavorited ? (
            <FavoriteIcon sx={{ color: '#ef4444', fontSize: '1.4rem' }} />
          ) : (
             <FavoriteIcon sx={{ color: 'white', fontSize: '1.4rem', opacity: 0.8 }} />
          )}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="mb-3">
          <h2 className="text-[28px] font-bold text-[#1a1a1a] font-dmsans tracking-tight">
            {house.price
              ? `$${Number(house.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              : "Contact for Price"}
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex flex-col gap-0.5">
             <div className="flex items-center gap-1.5 text-gray-900 font-bold text-[16px]">
               {house.bedroom_total || '0'} <span className="text-gray-400 font-medium text-xs uppercase tracking-tighter">bds</span>
               <span className="text-gray-200 ml-1">|</span>
               {totalBaths || '0'} <span className="text-gray-400 font-medium text-xs uppercase tracking-tighter">ba</span>
               <span className="text-gray-200 ml-1">|</span>
               {house.built_area ? Number(house.built_area).toLocaleString() : '0'} <span className="text-gray-400 font-medium text-xs uppercase tracking-tighter">sqft</span>
             </div>
          </div>
          <div className="h-6 w-[1px] bg-gray-100 hidden sm:block"></div>
          <div className="text-gray-500 font-medium text-sm line-clamp-1 border-l pl-4 border-gray-200">
            {house.home_type || 'Single Family'}
          </div>
        </div>

        <div className="text-[14px] text-gray-500 font-medium leading-relaxed mt-auto flex items-center gap-1">
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {house.location_city ? `${house.location_city}, ${house.location_state}` : "Address not available"}
        </div>
      </div>
    </Link>
  );
}
