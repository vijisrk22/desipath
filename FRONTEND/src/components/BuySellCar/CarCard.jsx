import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import FavoriteIcon from "@mui/icons-material/Favorite";

import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CarCard({ car }) {
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
          car?.pictures && car.pictures.length > 0
            ? `${api.defaults.baseURL}/${car.pictures[0]}`
            : "/img/cars/backgroundCarImg.png"
        }
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/cars/backgroundCarImg.png";
        }}
        title="car"
        sx={{
          height: 220,
          objectFit: "cover",
          p: 0
        }}
      />
      <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
        <div className="flex justify-between items-start mb-2">
          <div className="text-[#007185] text-[22px] font-bold font-dmsans truncate flex-1">
            {car.make} {car.model}
          </div>
          <div className="text-gray-400 text-sm font-medium ml-2">
            {car.year}
          </div>
        </div>

        <div className="text-gray-500 text-sm font-normal font-dmsans line-clamp-2 min-h-[40px] mb-4">
          {car.description || "No description available for this vehicle."}
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

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="text-[#007185] text-2xl font-bold font-dmsans">
            ${car.price ? Number(car.price).toLocaleString() : "TBD"}
          </div>

          <Link to={`/services/cars/buyCar/${car.id}`} className="px-5 py-2 bg-[#ffa41c] hover:bg-[#ff9900] rounded-full text-gray-800 text-sm font-bold transition-colors">
            Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
