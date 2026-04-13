import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import ButtonRight from "../ButtonRight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import api from "../../utils/api";
import { useState } from "react";

export default function RoomCard({ room }) {
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
      <button
        onClick={() => setIsFavorited(!isFavorited)}
        className="absolute top-3 right-4  flex items-center justify-center bg-white/40 p-2 rounded-full shadow-md"
      >
        {isFavorited ? (
          <FavoriteIcon
            sx={{ width: "1.5rem", height: "1.5rem", color: "red" }}
          />
        ) : (
          <img
            src={isFavorited ? "/heartFilled.svg" : "/heart.svg"}
            alt="heart"
            className="w-6 h-6"
          />
        )}
      </button>
      <CardMedia
        component="img"
        image={
          room?.photos && room.photos.length > 0
            ? `${api.defaults.baseURL}/${room.photos[0]}`
            : "/img/roommates/roommatePlaceholder.png"
        }
        title="room"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/roommates/roommatePlaceholder.png";
        }}
        sx={{
          height: 220,
          objectFit: "cover",
          p: 0
        }}
      />

      <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
        <div className="text-[#007185] text-[24px] font-bold font-dmsans truncate mb-2">
          {room.type || "Single Room"}
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <img src="/location.svg" className="w-5 h-5 opacity-70" />
          <div className="text-[16px] font-medium font-dmsans truncate capitalize">
            {room.location_city}, {room.location_state}
          </div>
        </div>
      </CardContent>
      <CardActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <div className="flex justify-between items-center w-full gap-2">
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="text-[#007185] text-xl font-bold font-dmsans whitespace-nowrap">
              {room.rent 
                ? `$${Number(room.rent).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` 
                : "N/A"}
            </span>
            <span className="text-gray-500 text-sm font-medium whitespace-nowrap">/{room.rent_frequency}</span>
          </div>
          <ButtonRight
            text="Details"
            path={`/services/roommates/${room.id}`}
            textClass="text-sm font-bold"
            paddingClass="px-6 py-2.5"
          />
        </div>
      </CardActions>
    </Card>
  );
}
