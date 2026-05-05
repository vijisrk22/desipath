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
      sx={{ minHeight: 375, maxWidth: 345, borderRadius: 5 }}
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
          rentalHome?.images && rentalHome.images.length > 0
            ? `${api.defaults.baseURL}/${rentalHome.images[0]}`
            : "https://via.placeholder.com/167"
        }
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/167";
        }}
        title="rental home"
        sx={{
          p: 1,
          height: 270,
          objectFit: "cover", // optional, looks better
          borderRadius: 5, // optional, if you want rounded corners
        }}
      />

      <Link to={`/services/rentalHomes/${rentalHome.id}`}>
        <CardContent>
          <div className=" mx-3">
            {/* Rent Amount */}
            <div className="flex justify-start items-center">
              <div className=" text-blue-700 text-2xl font-extrabold font-dmsans">
                ${rentalHome.deposit_rent}
              </div>
              <div className=" opacity-50 justify-center text-gray-800 text-base font-medium font-dmsans">
                /month
              </div>
            </div>
            {/* Rental Home Details */}
            <div className="flex my-3.5 justify-between">
              <div className="flex items-center justify-center gap-2 mr-1">
                <img src="/img/rentalHomes/bedIcon.svg" />
                <span className="opacity-70 text-gray-800 text-sm font-medium font-dmsans">
                  {rentalHome?.bhk?.split(" ")[0]} Beds{" "}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mr-1">
                <img src="/img/rentalHomes/bathIcon.svg" />
                <span className="opacity-70 text-gray-800 text-sm font-medium font-dmsans">
                  {rentalHome?.bhk?.split(" ")[2]} Bathrooms
                </span>
              </div>

              <div className="flex items-center justify-center gap-2 mr-1">
                <img src="/img/rentalHomes/squareMetersIcon.svg" />
                <span className="opacity-70 text-gray-800 text-sm font-medium font-dmsans">
                  {Math.floor(rentalHome?.area)} m<sup>2</sup>
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="mb-3.5 opacity-50 text-gray-800 text-base font-medium font-dmsans truncate">
              {rentalHome?.address}
            </div>

            {/* Horizontal Line */}
            <div className=" mb-8 h-0 outline outline-[1.50px]  outline-indigo-50" />

            {/*City */}
            <div className=" text-gray-800 text-2xl font-bold font-dmsans">
              {rentalHome?.property_type}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
