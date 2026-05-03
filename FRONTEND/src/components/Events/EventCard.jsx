import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import dayjs from "dayjs";

import { useState } from "react";
import LikeButton from "../LikeButton";
import ShareButton from "../ShareButton";
import ShareIcon from "@mui/icons-material/Share";

import { Link, useNavigate } from "react-router-dom";
import { getFullImageUrl } from "../../utils/imageHelper";

import LazyImage from "../LazyImage";

export default function EventCard({ event }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();

  const mainImage = event?.image ? getFullImageUrl(event.image) : "/img/events/eventSmpl1.png";

  const handleCardClick = () => {
    navigate(`/services/events/findEvent/${event.id}`);
  };

  return (
    <Card
      sx={{ 
        width: "100%", 
        maxWidth: 420,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
        }
      }}
      className="shadow-sm border border-gray-100"
    >
      <CardActionArea 
        onClick={handleCardClick}
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <div className="relative h-[240px] overflow-hidden">
          <LazyImage
            src={mainImage}
            alt={event?.title || "event"}
            className="w-full h-full object-cover"
          />
          {event?.event_type && (
            <div className="absolute top-3 left-3 text-white/70 text-[10px] font-bold uppercase tracking-widest drop-shadow-md z-10 font-dmsans">
              {event.event_type}
            </div>
          )}
        </div>
        <CardContent sx={{ flexGrow: 1, px: 3, pt: 3, width: '100%' }}>
          <div className="text-[#007185] text-base font-bold font-dmsans truncate mb-2">
            {event.title}
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <img src="/location.svg" className="w-5 h-5 opacity-70" />
              <div className="text-xs font-semibold font-dmsans capitalize truncate">
                {event.location_city ? `${event.location_city}, ${event.location_zipcode}, ${event.location_state}` : event.location}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <img src="/calendar.svg" className="w-5 h-5 opacity-70" />
              <div className="text-xs font-semibold font-dmsans capitalize">
                {dayjs(event.date).format("ddd, DD/MM/YYYY [at] h:mm A")}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
            <div className="text-black text-2xl font-bold font-dmsans">
              {event.ticketPrice === 0 ? "Free" : event.ticketPrice}
            </div>
          </div>
        </CardContent>
      </CardActionArea>

      {/* Action buttons kept outside the CardActionArea to remain clickable independently */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        <ShareButton
          url={`${window.location.origin}/services/events/findEvent/${event.id}`}
          IconComponent={ShareIcon}
          iconProps={{ sx: { color: "#007185", fontSize: "1.2rem" } }}
          buttonClass="relative bg-white shadow-md w-9 h-9 border border-gray-100"
        />
        <div className="bg-white shadow-md rounded-full w-9 h-9 flex items-center justify-center border border-gray-100">
          <LikeButton
            isFavorited={isFavorited}
            setIsFavorited={setIsFavorited}
          />
        </div>
      </div>
    </Card>
  );
}
