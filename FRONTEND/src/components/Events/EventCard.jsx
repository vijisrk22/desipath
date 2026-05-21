import dayjs from "dayjs";
import { useState } from "react";
import LikeButton from "../LikeButton";
import ShareButton from "../ShareButton";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { useNavigate } from "react-router-dom";
import { getFullImageUrl } from "../../utils/imageHelper";

import LazyImage from "../LazyImage";
import { generateRandomSuffix } from "../../utils/urlHelper";
import { getStateCode } from "../../utils/locationHelper";

export default function EventCard({ event }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const mainImage = event?.image ? getFullImageUrl(event.image) : "/img/events/eventSmpl1.png";

  const handleCardClick = () => {
    navigate(`/events/findEvent/${event.id}-${generateRandomSuffix(event.id)}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group block bg-white rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full relative cursor-pointer"
      style={{ minHeight: "450px", maxWidth: "350px" }}
    >
      {/* Image Section */}
      <div className="w-full h-[270px] p-2 overflow-hidden shrink-0">
        <LazyImage
          src={mainImage}
          alt={event?.title || "event"}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-700"
        />
        {event?.event_type && (
          <div className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg z-10 font-dmsans">
            {typeof event?.event_type === 'object' ? event.event_type.name : event.event_type}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-5 py-4 flex flex-col flex-grow bg-white">
        <div className="text-[#0857d0] text-lg font-bold font-dmsans truncate mb-2 group-hover:text-blue-600 transition-colors">
          {typeof event?.title === 'object' ? event.title.name : event.title}
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500">
            <img src="/location.svg" className="w-4 h-4 opacity-70" />
            <div className="text-xs font-semibold font-dmsans capitalize truncate">
              {event.location_city ? `${event.location_city}, ${getStateCode(event.location_state)}` : event.location}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <img src="/calendar.svg" className="w-4 h-4 opacity-70" />
            <div className="text-xs font-semibold font-dmsans capitalize">
              {dayjs(event.date).format("ddd, DD/MM/YYYY [at] h:mm A")}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="text-gray-800 text-2xl font-bold font-dmsans">
            {event.ticketPrice === 0 || String(event.ticketPrice).toLowerCase() === 'free' 
              ? "Free" 
              : (!event.ticketPrice 
                  ? "$0" 
                  : (isNaN(Number(event.ticketPrice)) 
                      ? event.ticketPrice 
                      : `$${Math.round(Number(event.ticketPrice)).toLocaleString("en-US")}`))}
          </div>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <ShareButton
              url={`${window.location.origin}/events/findEvent/${event.id}-${generateRandomSuffix(event.id)}`}
              IconComponent={ShareIcon}
              iconProps={{ sx: { color: "#0857d0", fontSize: "1.2rem" } }}
              buttonClass="relative bg-white shadow-md w-9 h-9 border border-gray-100 flex items-center justify-center rounded-full hover:bg-blue-50 transition-colors"
            />
            <div className="bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center border border-gray-100 hover:bg-red-50 transition-colors">
              <LikeButton
                isFavorited={isFavorited}
                setIsFavorited={setIsFavorited}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
