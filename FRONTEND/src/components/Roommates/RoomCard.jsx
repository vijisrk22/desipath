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
          room?.photos && room.photos.length > 0
            ? `${api.defaults.baseURL}/${room.photos[0]}`
            : "https://via.placeholder.com/167"
        }
        title="room"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "https://via.placeholder.com/167";
        }}
        sx={{
          height: 270,
          objectFit: "cover", // optional, looks better
          borderRadius: "8px", // optional, if you want rounded corners
        }}
      />

      <CardContent>
        <div className="text-gray-800 text-[26px] font-medium font-dmsans">
          {room.type || "Single Room"}
        </div>
        <div className="justify-start items-center gap-2 inline-flex">
          <img src="/location.svg" className="w-[24px] h-[24px]" />
          <div className="text-gray-500 text-[22px] max-w-[300px] font-normal font-dmsans truncate">
            {room.location_city}, {room.location_state}, {room.location_zipcode}
          </div>
        </div>
      </CardContent>
      <CardActions>
        <div className=" flex justify-between items-center flex-1">
          <div>
            <span className="text-gray-800 text-xl font-semibold font-dmsans">
              $ {room.rent}
            </span>
            <span className="text-gray-500 text-base font-normal font-dmsans">
              /{room.rent_frequency}
            </span>
          </div>
          <ButtonRight
            text="Details"
            path={`/services/roommates/${room.id}`}
            textClass="text-base"
            paddingClass="px-[25px] py-[18px]"
          />
        </div>
      </CardActions>
    </Card>
  );
}
