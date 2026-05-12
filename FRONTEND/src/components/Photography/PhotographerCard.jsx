import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { getFullImageUrl } from "../../utils/imageHelper";
import LazyImage from "../LazyImage";
import { useState } from "react";
import { generateRandomSuffix } from "../../utils/urlHelper";
import { getStateCode } from "../../utils/locationHelper";

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
    ? `${photographer.locations[0].city}, ${getStateCode(photographer.locations[0].state)}`
    : "Location not specified";

  return (
    <div
      className="group block bg-white rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full relative"
      style={{ minHeight: "450px", maxWidth: "350px" }}
    >
      <Link 
        to={`/services/photography/details/${photographer.id}-${generateRandomSuffix(photographer.id)}`}
        className="flex flex-col h-full"
      >
        {/* Backdrop Section */}
        <div className="relative h-28 overflow-hidden shrink-0">
          <img 
            src={backdropImage} 
            alt="Backdrop" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full shadow-lg z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white">
              <img 
                src={mainImage} 
                alt={photographer.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
            <span className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-bold text-blue-600 shadow-sm uppercase tracking-wider">
              {typeof photographer?.service_type === 'object' ? photographer.service_type.name : photographer.service_type}
            </span>
            {photographer.open_to_travel && (
              <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm uppercase tracking-wider">
                Travel Ready
              </span>
            )}
          </div>
        </div>

        <div className="px-5 pt-12 pb-4 flex flex-col flex-grow bg-white">
          <div className="mb-3">
             <Tooltip title={photographer.title} arrow placement="top">
                <h3 className="text-lg font-bold text-[#0857d0] line-clamp-1 cursor-help group-hover:text-blue-600 transition-colors font-dmsans">
                    {typeof photographer?.title === 'object' ? photographer.title.name : photographer.title}
                </h3>
             </Tooltip>
             <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                <span className="text-xs">🏢</span>
                <span className="text-xs font-semibold font-dmsans">{location}</span>
             </div>
          </div>

          <p className="text-gray-500 text-xs font-medium font-dmsans line-clamp-2 mb-4 h-8">
            {photographer.bio}
          </p>

          <div className="flex items-center gap-3 mb-4 text-gray-600 border-y border-gray-50 py-3">
            <div className="flex flex-col items-center gap-1 flex-1">
              <span className="text-xs">🗓️</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{photographer.experience_years}y Exp</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 border-x border-gray-50 px-2 justify-center">
              <span className="text-xs">🌐</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate w-full text-center">{photographer.languages || 'English'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 justify-end">
              <span className="text-xs">📹</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{photographer.video_url ? 'Has Reel' : 'No Reel'}</span>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-gray-400">Starting from</span>
              <span className="text-gray-800 text-xl font-bold font-dmsans">
                {minPrice ? `$${Number(minPrice).toLocaleString("en-US")}` : "Contact"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
