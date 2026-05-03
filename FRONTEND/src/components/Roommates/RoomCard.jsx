import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import WcIcon from '@mui/icons-material/Wc';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getFullImageUrl } from "../../utils/imageHelper";
import { useNavigate } from "react-router-dom";

import LazyImage from "../LazyImage";

export default function RoomCard({ room }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const mainImage = room?.photos && room.photos.length > 0
    ? getFullImageUrl(room.photos[0])
    : "/img/roommates/roommatePlaceholder.png";

  const handleCardClick = () => {
    navigate(`/services/roommates/${room.id}`);
  };

  const renderGenderIcon = () => {
    if (room.gender_preference === 'Male') return <ManIcon fontSize="small" titleAccess="Male Only" />;
    if (room.gender_preference === 'Female') return <WomanIcon fontSize="small" titleAccess="Female Only" />;
    return <WcIcon fontSize="small" titleAccess="Any Gender" />;
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{ 
        width: "100%", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)"
        },
        "&:active": {
          transform: "scale(0.98)",
        }
      }}
      className="relative shadow-sm border border-gray-100 overflow-hidden"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsFavorited(!isFavorited);
        }}
        className="absolute top-3 right-4 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
      >
        {isFavorited ? (
          <FavoriteIcon
            sx={{ width: "1.2rem", height: "1.2rem", color: "#ff4d4f" }}
          />
        ) : (
          <img
            src="/heart.svg"
            alt="heart"
            className="w-5 h-5 opacity-60"
          />
        )}
      </button>

      <div className="relative overflow-hidden group h-[240px]">
        <LazyImage
          src={mainImage}
          alt={room.type || "room"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-3 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <div className="flex items-baseline gap-1">
            <span className="text-[#0857d0] text-lg font-bold font-dmsans">
              {room.rent 
                ? `$${Number(room.rent).toLocaleString("en-US")}` 
                : "N/A"}
            </span>
            <span className="text-gray-600 text-xs font-medium">/{room.rent_frequency || 'Monthly'}</span>
          </div>
        </div>
      </div>

      <CardContent sx={{ flexGrow: 1, px: 3, pt: 2.5, pb: "16px !important" }}>
        <div className="text-gray-900 text-[20px] font-bold font-dmsans truncate mb-1">
          {room.type || "Single Room"}
        </div>
        
        <div className="flex items-start gap-1 text-gray-500 mb-3">
          <LocationOnIcon sx={{ fontSize: 18, mt: 0.3, opacity: 0.7 }} />
          <div className="text-[14px] font-medium font-dmsans leading-tight">
            <div className="text-gray-800 font-semibold">{room.address || 'Address not provided'}</div>
            <div className="capitalize">{room.location_city}, {room.location_state} {room.location_zipcode}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-auto pt-3 border-t border-gray-100 text-gray-400">
          {room.car_parking_available && (
            <LocalParkingIcon fontSize="small" titleAccess="Parking Available" className="hover:text-[#0857d0] transition-colors" />
          )}
          {room.kitchen_available && (
            <KitchenIcon fontSize="small" titleAccess="Kitchen Available" className="hover:text-[#0857d0] transition-colors" />
          )}
          {room.washer_dryer && (
            <LocalLaundryServiceIcon fontSize="small" titleAccess="Washer/Dryer Available" className="hover:text-[#0857d0] transition-colors" />
          )}
          <div className="ml-auto flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded text-[12px] font-bold">
            {renderGenderIcon()}
            <span className="uppercase tracking-wider">{room.gender_preference || 'Any'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
