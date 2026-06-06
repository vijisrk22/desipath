import React from "react";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { getFullImageUrl } from "../../utils/imageHelper";

import LazyImage from "../LazyImage";
import { generateRandomSuffix } from "../../utils/urlHelper";
import { getStateCode } from "../../utils/locationHelper";

export default function KidsClassCard({ cls }) {
  const mainImage = cls.photoUrl 
    ? getFullImageUrl(cls.photoUrl)
    : "/img/kidsclass_default.jpg";

  return (
    <Link 
      to={`/kids-class/details/${cls.id}-${generateRandomSuffix(cls.id)}`}
      className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden w-full relative hover:-translate-y-1"
    >
      <div className="relative h-[220px] w-full overflow-hidden shrink-0">
        <LazyImage
          src={mainImage}
          alt={cls.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col flex-grow px-5 pt-4 pb-5 bg-white">
        <div className="flex justify-between items-baseline mb-3 gap-2 overflow-hidden">
          <div className="flex items-baseline gap-1 flex-shrink-0">
            <span className="text-[#007185] text-2xl font-bold font-dmsans whitespace-nowrap">
              {cls.fee_amount 
                ? `₹${Number(cls.fee_amount).toLocaleString("en-IN")}` 
                : "Contact"}
            </span>
            <span className="text-gray-400 text-xs font-medium whitespace-nowrap">/{cls.fee_type?.replace('_', ' ') || 'class'}</span>
          </div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider truncate">
            {cls.category || "Class"}
          </div>
        </div>

        <div className="mb-4">
           <Tooltip title={cls.title} arrow placement="top">
              <h3 className="text-base font-bold text-gray-900 line-clamp-2 cursor-help min-h-[48px]">{cls.title}</h3>
           </Tooltip>
           <p className="text-gray-500 text-xs font-medium">by {cls.instructorName}</p>
        </div>

        <div className="flex items-center gap-3 mb-4 text-gray-600 border-y border-gray-50 py-3 mt-auto">
          <div className="flex items-center gap-1.5 flex-1">
            <span className="text-sm">👶</span>
            <span className="text-xs font-semibold">{cls.age_group_min}-{cls.age_group_max}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 border-x border-gray-50 px-2 justify-center">
            <span className="text-sm">💻</span>
            <span className="text-xs font-semibold truncate">{(cls.format || [])[0] || 'Varies'}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1 justify-end">
            <span className="text-sm">⏱️</span>
            <span className="text-xs font-semibold truncate">{cls.duration_label || 'Varies'}</span>
          </div>
        </div>

         <div className="flex items-start gap-2 h-6">
            <img src="/location.svg" className="w-3.5 h-3.5 mt-0.5 opacity-50" alt="Location" />
            <div className="text-gray-500 text-xs font-medium leading-normal line-clamp-1">
              {cls.location_city ? `${cls.location_city}, ${getStateCode(cls.location_state)}` : (cls.location_address || "Online / Hybrid")}
            </div>
         </div>
      </div>
    </Link>
  );
}
