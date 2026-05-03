import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tooltip from "@mui/material/Tooltip";
import { getFullImageUrl } from "../../utils/imageHelper";
import LazyImage from "../LazyImage";

export default function PhotographerCard({ photographer }) {
  const mainImage = photographer.profile_photo 
    ? getFullImageUrl(photographer.profile_photo)
    : "/img/photography/default_profile.png";

  const backdropImage = photographer.backdrop_photo
    ? getFullImageUrl(photographer.backdrop_photo)
    : "/img/photography/default_backdrop.png";

  const minPrice = photographer.packages?.length > 0 
    ? Math.min(...photographer.packages.map(p => p.price))
    : null;

  const location = photographer.locations?.[0] 
    ? `${photographer.locations[0].city}, ${photographer.locations[0].state}`
    : "Location not specified";

  return (
    <Card
      sx={{ 
        width: "100%", 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
        }
      }}
      className="relative shadow-sm border border-gray-100 group"
    >
      <Link 
        to={`/services/photography/details/${photographer.id}`}
        className="flex flex-col h-full"
      >
        {/* Backdrop & Profile Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={backdropImage} 
            alt="Backdrop" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full shadow-lg">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={mainImage} 
                alt={photographer.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute top-3 right-3 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 shadow-sm uppercase tracking-wider">
              {photographer.service_type}
            </span>
          </div>
        </div>

        <CardContent sx={{ flexGrow: 1, px: 3, pt: 12, pb: 3 }}>
          <div className="mb-4">
             <Tooltip title={photographer.title} arrow placement="top">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 cursor-help group-hover:text-blue-600 transition-colors">
                    {photographer.title}
                </h3>
             </Tooltip>
             <div className="flex items-center gap-2 mt-1 text-gray-500">
                <span className="text-sm">🏢</span>
                <span className="text-sm font-medium">{location}</span>
             </div>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
            {photographer.bio}
          </p>

          <div className="flex items-center gap-3 mb-5 text-gray-600 border-y border-gray-50 py-3">
            <div className="flex items-center gap-1.5 flex-1">
              <span className="text-sm">🗓️</span>
              <span className="text-xs font-semibold">{photographer.experience_years}y Exp</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 border-x border-gray-50 px-2 justify-center">
              <span className="text-sm">🌐</span>
              <span className="text-xs font-semibold truncate">{photographer.languages || 'English'}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-1 justify-end">
              <span className="text-sm">📹</span>
              <span className="text-xs font-semibold">{photographer.video_url ? 'Has Reel' : 'No Reel'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400">Starting from</span>
              <span className="text-[#007185] text-2xl font-black font-dmsans">
                {minPrice ? `₹${Number(minPrice).toLocaleString("en-IN")}` : "Contact"}
              </span>
            </div>
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
              View Profile
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
