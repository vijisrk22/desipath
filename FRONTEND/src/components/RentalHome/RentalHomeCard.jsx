import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getFullImageUrl } from "../../utils/imageHelper";
import { getStateCode } from "../../utils/locationHelper";

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
              ? getFullImageUrl(rentalHome.images[0])
              : "/rentalHomeHero.png"
          }
          onError={(e) => {
            // Do not replace with alternative image as per user request
            // Instead, we can mark it as broken to show the URL in title
            e.currentTarget.setAttribute('data-broken', 'true');
            const url = e.currentTarget.src;
            e.currentTarget.title = `Broken Image URL: ${url}`;
          }}
          title={rentalHome?.address || "rental home"}
          sx={{
            height: 220,
            objectFit: "cover",
            p: 0,
            // Visual feedback for broken images if needed
            "&[data-broken='true']": {
              backgroundColor: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }
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
              <span className="text-xs font-semibold">{Math.floor(rentalHome?.area || 0)} sqft</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
             <img src="/location.svg" className="w-4 h-4 mt-1 opacity-60" />
             <div className="text-gray-500 text-sm font-medium leading-normal line-clamp-2">
               {(() => {
                  const addr = rentalHome?.address || "";
                  const city = rentalHome?.location_city || "";
                  const state = getStateCode(rentalHome?.location_state || "");
                  const zip = rentalHome?.location_zipcode || "";
                  const truncatedZip = zip.substring(0, 5);
                  return `${addr}${city ? `, ${city}` : ""}${state ? `, ${state}` : ""}${truncatedZip ? ` ${truncatedZip}` : ""}` || "Location not available";
               })()}
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
