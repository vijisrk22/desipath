import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getFullImageUrl } from "../../utils/imageHelper";
import LazyImage from "../LazyImage";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = useMemo(() => {
    if (!car.pictures) return [];
    try {
      const parsed = typeof car.pictures === "string" ? JSON.parse(car.pictures) : car.pictures;
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
      console.error("Error parsing car images:", e);
      return [];
    }
  }, [car.pictures]);

  const mainImage = images.length > 0 ? getFullImageUrl(images[0]) : "/img/cars/backgroundCarImg.png";

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
        className="absolute top-3 right-4  flex items-center justify-center bg-white/40 p-2 rounded-full shadow-md z-20"
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

      {(String(car.is_dealer) === "1" || car.is_dealer === true) && (
        <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg z-10 border border-red-700">
          Dealer listing
        </div>
      )}

      <div 
        className="relative cursor-pointer overflow-hidden h-[220px]"
        onClick={() => navigate(`/services/cars/buyCar/${car.id}`)}
      >
        <LazyImage
          src={mainImage}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
        <div className="flex justify-between items-start mb-2">
          <div className="text-[#007185] text-[22px] font-bold font-dmsans truncate flex-1">
            {car.make} {car.model}
          </div>
          <div className="text-gray-400 text-sm font-medium ml-2">
            {car.year}
          </div>
        </div>

        <div className="flex flex-col gap-1 min-h-[40px] mb-4">
          <div className="flex items-start gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 min-w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div className="text-gray-500 text-sm font-normal font-dmsans line-clamp-2">
              {car.location_city 
                ? `${car.location_city}, ${car.location_zipcode}, ${car.location_state}`
                : car.location || "Location not provided"}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 py-4 flex justify-between items-center">
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <img src="/img/cars/mileage.png" className="w-4 h-4 opacity-70" />
            <div className="text-gray-600 text-xs font-semibold font-dmsans">
              {car.miles ? `${Number(car.miles).toLocaleString()} mi` : "-"}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1 border-x border-gray-50">
            <img src="/img/cars/fuel.svg" className="w-4 h-4 opacity-70" />
            <div className="text-gray-600 text-xs font-semibold font-dmsans truncate w-full text-center px-1">
              {typeof car.fuel_type === 'string' ? car.fuel_type : car.fuel_type?.name || car.fuelType?.name || "-"}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-1">
            <img src="/img/cars/transmissionType.svg" className="w-4 h-4 opacity-70" />
            <div className="text-gray-600 text-xs font-semibold font-dmsans truncate w-full text-center px-1">
              {car.transmission_name || car.transmission?.name || (typeof car.transmission === 'string' ? car.transmission : "-")}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-2">
          <div className="text-[#007185] text-xl md:text-2xl font-bold font-dmsans whitespace-nowrap flex-shrink-0">
            {car.price 
              ? `$${Number(car.price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}` 
              : "TBD"}
          </div>

          <Link to={`/services/cars/buyCar/${car.id}`} className="px-5 py-2 bg-[#ffa41c] hover:bg-[#ff9900] rounded-full text-gray-800 text-sm font-bold transition-colors whitespace-nowrap flex-shrink-0">
            Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
