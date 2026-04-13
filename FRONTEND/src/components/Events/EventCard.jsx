import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import dayjs from "dayjs";

import { useState } from "react";
import LikeButton from "../LikeButton";
import ShareButton from "../ShareButton";
import ShareIcon from "@mui/icons-material/Share";

import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card
      sx={{ 
        width: "100%", 
        maxWidth: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.12)"
        }
      }}
      className="relative shadow-sm border border-gray-100"
    >
      <Link to={`/services/events/findEvent/${event.id}`}>
        <CardMedia
          component="img"
          image={event?.image}
          title={event?.title}
          sx={{ 
            height: 240,
            objectFit: "cover",
            p: 0,
          }}
        />
      </Link>
      <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
        <div className="text-[#007185] text-[22px] font-bold font-dmsans truncate mb-3">
          {event.title}
        </div>
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-gray-500">
            <img src="/location.svg" className="w-5 h-5 opacity-70" />
            <div className="text-sm font-medium font-dmsans capitalize truncate">
              {event.location}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500">
            <img src="/calendar.svg" className="w-5 h-5 opacity-70" />
            <div className="text-sm font-medium font-dmsans capitalize">
              {dayjs(event.date).format("ddd, DD/MM/YYYY [at] h:mm A")}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <div className="text-[#007185] text-xl font-bold font-dmsans">
            {event.ticketPrice === 0 ? "Free" : event.ticketPrice}
          </div>

          <div className="flex items-center gap-2">
            <LikeButton
              isFavorited={isFavorited}
              setIsFavorited={setIsFavorited}
            />
            <ShareButton
              url=""
              IconComponent={ShareIcon}
              iconProps={{ sx: { color: "#007185", fontSize: "1.25rem" } }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
