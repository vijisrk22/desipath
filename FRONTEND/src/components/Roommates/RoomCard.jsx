import FavoriteIcon from "@mui/icons-material/Favorite";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import LocalLaundryServiceOutlinedIcon from "@mui/icons-material/LocalLaundryServiceOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import WcOutlinedIcon from "@mui/icons-material/WcOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import Tooltip from "@mui/material/Tooltip";
import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { generateAddressSuffix } from "../../utils/urlHelper";
import LazyImage from "../LazyImage";
import { getStateCode } from "../../utils/locationHelper";
import { getFullImageUrl } from "../../utils/imageHelper";

export default function RoomCard({ room }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Link
      to={`/services/roommates/${room.id}-${generateAddressSuffix(room.id, room.address)}`}
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

        <div className="flex items-start gap-2 mb-3 min-h-[20px]">
          <img src="/location.svg" className="w-4 h-4 opacity-60 mt-0.5" alt="location" />
          <div className="text-gray-500 text-xs font-medium font-dmsans flex flex-col w-full overflow-hidden">
            <span className="truncate">
              {typeof room.location_city === 'object' ? (room.location_city?.name || "") : room.location_city}, {getStateCode(typeof room.location_state === 'object' ? room.location_state?.name : room.location_state)} {room.location_zipcode || ''}
            </span>
            {room.address && (
              <span className="truncate text-gray-400 mt-0.5">
                {room.address}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-2 text-gray-500">
          <Tooltip title={`Kitchen Access: ${room.kitchen_available == 1 || room.kitchen_available === true || room.kitchen_available === 'Yes' ? 'Yes' : 'No'}`}>
            <KitchenOutlinedIcon fontSize="small" className={room.kitchen_available == 1 || room.kitchen_available === true || room.kitchen_available === 'Yes' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Shared Bathroom: ${room.shared_bathroom == 1 || room.shared_bathroom === true || room.shared_bathroom === 'Yes' ? 'Yes' : 'No'}`}>
            <BathtubOutlinedIcon fontSize="small" className={room.shared_bathroom == 1 || room.shared_bathroom === true || room.shared_bathroom === 'Yes' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Washer/Dryer: ${room.washer_dryer == 1 || room.washer_dryer === true || room.washer_dryer === 'Yes' ? 'Yes' : 'No'}`}>
            <LocalLaundryServiceOutlinedIcon fontSize="small" className={room.washer_dryer == 1 || room.washer_dryer === true || room.washer_dryer === 'Yes' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Car Parking: ${room.car_parking_available == 1 || room.car_parking_available === true || room.car_parking_available === 'Yes' ? 'Yes' : 'No'}`}>
            <DirectionsCarOutlinedIcon fontSize="small" className={room.car_parking_available == 1 || room.car_parking_available === true || room.car_parking_available === 'Yes' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Furnished: ${room.is_furnished == 1 || room.is_furnished === true || room.is_furnished === 'Yes' ? 'Yes' : 'No'}`}>
            <ChairOutlinedIcon fontSize="small" className={room.is_furnished == 1 || room.is_furnished === true || room.is_furnished === 'Yes' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Gender Preference: ${room.gender_preference || 'Any'}`}>
            <WcOutlinedIcon fontSize="small" className={room.gender_preference && room.gender_preference !== 'Any' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
          <Tooltip title={`Food Preference: ${room.food_preference || 'Any'}`}>
            <RestaurantOutlinedIcon fontSize="small" className={room.food_preference && room.food_preference !== 'Any' ? "text-[#1565D8]" : "opacity-30"} />
          </Tooltip>
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

