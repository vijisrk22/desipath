import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";

import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RentalHomeCard({ rentalHome }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card
      sx={{ 
        width: "100%", 
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

      <Link 
        to={`/services/rentalhomes/${rentalHome.id}`}
        className="flex flex-col h-full"
      >
        <CardMedia
          component="img"
          image={
            rentalHome?.images && rentalHome.images.length > 0
              ? `https://desipathapi.azurewebsites.net/${rentalHome.images[0]}`
              : "/rentalHomeHero.png"
          }
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/rentalHomeHero.png";
          }}
          title="rental home"
          sx={{
            height: 220,
            objectFit: "cover",
            p: 0,
          }}
        />

        <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
          <div className="flex justify-between items-baseline mb-3 gap-2 overflow-hidden">
            <div className="flex items-baseline gap-1 flex-shrink-0">
              <span className="text-[#007185] text-2xl md:text-3xl font-bold font-dmsans whitespace-nowrap">
                {rentalHome.deposit_rent 
                  ? `$${Number(rentalHome.deposit_rent).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` 
                  : "N/A"}
              </span>
              <span className="text-gray-400 text-xs md:text-sm font-medium whitespace-nowrap">/month</span>
            </div>
            <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">
              {rentalHome?.property_type || "Rental"}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4 text-gray-600 border-y border-gray-50 py-3">
            <div className="flex items-center gap-1.5 flex-1">
              <img src="/img/rentalHomes/bedIcon.svg" className="w-4 h-4 opacity-70" />
              <span className="text-xs font-semibold">{rentalHome?.bhk?.split(" ")[0]} Bed</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 border-x border-gray-50 px-2 justify-center">
              <img src="/img/rentalHomes/bathIcon.svg" className="w-4 h-4 opacity-70" />
              <span className="text-xs font-semibold">{rentalHome?.bhk?.split(" ")[2]} Bath</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <img src="/img/rentalHomes/squareMetersIcon.svg" className="w-4 h-4 opacity-70" />
              <span className="text-xs font-semibold">{Math.floor(rentalHome?.area)} m²</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
             <img src="/location.svg" className="w-4 h-4 mt-1 opacity-60" />
             <div className="text-gray-500 text-sm font-medium leading-normal line-clamp-2">
               {rentalHome?.address || "Address not available"}
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
