import { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getFullImageUrl } from "../../utils/imageHelper";
import { getStateCode } from "../../utils/locationHelper";

import LazyImage from "../LazyImage";


export default function HouseCard({ house }) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Calculate total baths
  const totalBaths = (house.full_bathroom_total || 0) + (house.half_bathroom_total || 0);

  // Filter out empty strings or null values from images array
  const validImages = Array.isArray(house.images) 
    ? house.images.filter(img => img && typeof img === 'string' && img.trim() !== '' && img.trim() !== '""') 
    : [];

  const mainImage = validImages.length > 0
    ? getFullImageUrl(validImages[0]) || "/homesSmpl.png"
    : "/homesSmpl.png";

  const addressParts = [
    house.address,
    house.location_city,
    getStateCode(house.location_state),
    house.location_zipcode
  ].filter(Boolean);

  const addressSlug = addressParts.join(" ")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const urlSlug = addressSlug ? `${addressSlug}-${house.id}` : `${house.id}`;

  return (
    <Link
      to={`/services/BuyHome/${urlSlug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full"
    >
      {/* Image Section */}
      <div className="relative h-56 lg:h-64 overflow-hidden">
        <LazyImage
          src={mainImage}
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
             <div className="flex items-center text-gray-900 font-bold text-[16px]">
               {house.bedroom_total || '0'} <span className="text-gray-400 font-medium text-[10px] uppercase tracking-tighter ml-1">bd</span>
               <span className="text-gray-300 mx-2">|</span>
               {totalBaths || '0'} <span className="text-gray-400 font-medium text-[10px] uppercase tracking-tighter ml-1">ba</span>
               <span className="text-gray-300 mx-2">|</span>
               {house.built_area ? Number(house.built_area).toLocaleString() : '0'} <span className="text-gray-400 font-medium text-[10px] uppercase tracking-tighter ml-1">sqft</span>
             </div>
          </div>
          <div className="h-4 w-[1px] bg-gray-200 hidden sm:block mx-1"></div>
          <div className="text-gray-500 font-medium text-xs uppercase tracking-wide line-clamp-1">
            {(() => {
              const type = typeof house.home_type === 'object' ? house.home_type.name : (house.home_type || 'Single Family');
              if (type === 'Condominum') return 'Condominium';
              if (type === 'Town home') return 'Townhouse';
              return type;
            })()}
          </div>
        </div>

        <div className="text-[14px] text-gray-600 font-medium leading-snug mt-auto flex items-start gap-1.5">
          <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-2">
            {[
              house.address,
              house.location_city,
              getStateCode(house.location_state),
              house.location_zipcode
            ].filter(Boolean).join(", ") || "Address not available"}
          </span>
        </div>
      </div>
    </Link>
  );
}
