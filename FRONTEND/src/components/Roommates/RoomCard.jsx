import FavoriteIcon from "@mui/icons-material/Favorite";
import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateRandomSuffix } from "../../utils/urlHelper";
import LazyImage from "../LazyImage";
import { getStateCode } from "../../utils/locationHelper";
import { getFullImageUrl } from "../../utils/imageHelper";

export default function RoomCard({ room }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Link
      to={`/services/roommates/${room.id}-${generateRandomSuffix(room.id)}`}
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
            room?.photos && room.photos.length > 0
              ? getFullImageUrl(room.photos[0])
              : "/img/placeholder_property.jpg"
          }
          alt={room.type || "room"}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="px-5 py-4 flex flex-col flex-grow bg-white">
        <div className="text-gray-800 text-2xl font-bold font-dmsans mb-2 group-hover:text-blue-700 transition-colors">
          {typeof room?.type === 'object' ? room.type.name : (room.type || "Single Room")}
        </div>

        <div className="flex items-center gap-2 mb-4 min-h-[20px]">
          <img src="/location.svg" className="w-4 h-4 opacity-60" alt="location" />
          <div className="text-gray-500 text-xs font-medium font-dmsans truncate">
            {typeof room.location_city === 'object' ? (room.location_city?.name || "") : room.location_city}, {getStateCode(typeof room.location_state === 'object' ? room.location_state?.name : room.location_state)}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
          <div>
            <span className="text-blue-700 text-2xl font-bold font-dmsans">
              ${room.rent ? Math.round(Number(room.rent)).toLocaleString("en-US") : '0'}
            </span>
            <span className="text-gray-400 text-sm font-normal font-dmsans ml-1">
              /{room.rent_frequency || 'month'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

