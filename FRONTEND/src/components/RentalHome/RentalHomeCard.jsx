import FavoriteIcon from "@mui/icons-material/Favorite";
import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateRandomSuffix } from "../../utils/urlHelper";
import LazyImage from "../LazyImage";
import { getStateCode } from "../../utils/locationHelper";
import { getFullImageUrl } from "../../utils/imageHelper";

export default function RentalHomeCard({ rentalHome }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Link
      to={`/services/rentalHomes/${rentalHome.id}-${generateRandomSuffix(rentalHome.id)}`}
      className="group block bg-white rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full relative"
      style={{ minHeight: "450px", maxWidth: "350px" }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorited(!isFavorited);
        }}
        className="absolute z-10 top-3 right-4 flex items-center justify-center bg-white/40 p-2 rounded-full shadow-md hover:bg-white/60 transition-colors"
      >
        {isFavorited ? (
          <FavoriteIcon sx={{ width: "1.5rem", height: "1.5rem", color: "red" }} />
        ) : (
          <img src="/heart.svg" alt="heart" className="w-6 h-6" />
        )}
      </button>

      <div className="w-full h-[270px] p-2 overflow-hidden shrink-0">
        <LazyImage
          src={
            (() => {
              const validImages = Array.isArray(rentalHome?.images) 
                ? rentalHome.images.filter(img => img && typeof img === 'string' && img.trim() !== '' && img.trim() !== '""') 
                : [];
              return validImages.length > 0
                ? getFullImageUrl(validImages[0]) || "/img/placeholder_property.jpg"
                : "/img/placeholder_property.jpg";
            })()
          }
          alt={rentalHome?.property_type || "rental home"}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="px-5 py-4 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-blue-700 text-2xl font-bold font-dmsans">
              ${rentalHome.deposit_rent ? Math.round(Number(rentalHome.deposit_rent)).toLocaleString("en-US") : '0'}
            </span>
            <span className="text-gray-400 text-sm font-medium font-dmsans ml-1">
              /mo
            </span>
          </div>
          <div className="text-gray-800 text-sm font-bold font-dmsans">
            {typeof rentalHome?.property_type === 'object' ? rentalHome.property_type.name : (rentalHome?.property_type || "N/A")}
          </div>
        </div>

        <div className="flex mb-4 justify-between items-center w-full py-3 border-y border-gray-50">
          <div className="flex flex-col items-center gap-1 flex-1">
            <img src="/img/rentalHomes/bedIcon.svg" alt="Bedrooms" className="w-4 h-4 opacity-70" />
            <span className="text-gray-600 text-[10px] font-bold uppercase font-dmsans">
              {rentalHome?.bhk?.split(" ")[0] || "0"} Beds
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1 border-x border-gray-50">
            <img src="/img/rentalHomes/bathIcon.svg" alt="Bathrooms" className="w-4 h-4 opacity-70" />
            <span className="text-gray-600 text-[10px] font-bold uppercase font-dmsans">
              {rentalHome?.bhk?.split(" ")[2] || "0"} Baths
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 flex-1">
            <img src="/img/rentalHomes/squareMetersIcon.svg" alt="Area" className="w-4 h-4 opacity-70" />
            <span className="text-gray-600 text-[10px] font-bold uppercase font-dmsans">
              {Math.floor(rentalHome?.area || 0)} sqft
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-4 h-6">
          <img src="/location.svg" className="w-3.5 h-3.5 opacity-50" alt="location" />
          <div className="text-gray-500 text-[13px] font-medium font-dmsans truncate">
            {typeof rentalHome.location_city === 'object' ? (rentalHome.location_city?.name || "") : (rentalHome.location_city || rentalHome.city)}, {getStateCode(typeof rentalHome.location_state === 'object' ? rentalHome.location_state?.name : (rentalHome.location_state || rentalHome.state))}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
        </div>
      </div>
    </Link>
  );
}
