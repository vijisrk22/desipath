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
      sx={{ maxWidth: 345, height: 650, borderRadius: 5 }}
      className="relative"
    >
      <Link to={`/services/events/findEvent/${event.id}`}>
        <CardMedia
          component="img"
          image={event?.image}
          title={event?.title}
          sx={{ p: 1 }}
        />
      </Link>
      <CardContent>
        <div className="mx-1">
          {/* Event  title*/}
          <div className=" text-blue-700 text-2xl font-bold font-dmsans">
            {event.title}
          </div>
          {/* Event Location */}
          <div className="justify-start items-center gap-[74px] inline-flex mt-2">
            <div className="justify-start items-center gap-1 inline-flex">
              <img
                src="/location.svg"
                className="w-[20px] h-[20px] text-color-blue-500 "
              />
              <div className="text-gray-500 text-sm font-medium font-dmsans capitalize">
                {event.location}
              </div>
            </div>
          </div>

          {/* Event Date */}
          <div className="justify-start items-center gap-[74px] inline-flex">
            <div className="justify-start items-center gap-1 inline-flex">
              <img src="/calendar.svg" className="w-[20px] h-[20px]" />
              <div className="text-gray-500 text-sm font-medium font-dmsans capitalize">
                {dayjs(event.date).format("ddd, DD/MM/YYYY [at] h:mm A")}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-start  mt-3">
            {/* Event Price */}
            <div className="text-blue-700 text-xl font-bold font-dmsans">
              {event.ticketPrice === 0 ? "Free" : event.ticketPrice}
            </div>

            <div>
              <LikeButton
                isFavorited={isFavorited}
                setIsFavorited={setIsFavorited}
              />
              {/* Share button url */}
              <ShareButton
                url=""
                IconComponent={ShareIcon}
                iconProps={{ sx: { color: "#007185" } }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
