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
      sx={{ minHeight: 450, maxWidth: 350, p: 1, borderRadius: 5 }}
      className="relative"
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
            : "https://via.placeholder.com/167"
        }
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/167";
        }}
        title="car"
        sx={{
          height: 300,
          objectFit: "cover", // optional, looks better
          borderRadius: "15px", // optional, if you want rounded corners
        }}
      />
      <CardContent>
        <div className="mx-3">
          {/* Car make and model*/}
          <div className="text-blue-700 text-lg font-semibold font-dmsans truncate">
            {car.make} {car.model} – {car.year}
          </div>

          {/* Car Description */}
          <div className="text-gray-800 text-sm font-normal font-dmsans truncate mt-1 mb-3">
            {car.description}
          </div>

          {/* Car Main Features */}
          <div className="border-t border-gray-200 py-2.5 flex gap-[75px] justify-center  items-center">
            <div className="flex flex-col items-center gap-3">
              <img src="/img/cars/mileage.png" className="w-4 h-4" />
              <div className="text-gray-800 text-sm font-normal font-dmsans">
                {car.mileage}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <img src="/img/cars/fuel.svg" />
              <div className="text-gray-800 text-sm font-normal font-dmsans">
                {car.fuel}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <img src="/img/cars/transmissionType.svg" />
              <div className="text-gray-800 text-sm font-normal font-dmsans">
                {car.transmission}
              </div>
            </div>
          </div>

          {/* Car Price and View Details */}

          <div className="flex items-center justify-between mt-3">
            <div className="text-gray-800 text-xl font-bold font-dmsans">
              ${car.price}
            </div>

            <Link to={`/services/cars/buyCar/${car.id}`}>
              <div className="text-blue-700 text-base font-medium font-dmsans leading-7">
                View Details &#8594;
              </div>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
