import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Tooltip from "@mui/material/Tooltip";
import { getFullImageUrl } from "../../utils/imageHelper";

import LazyImage from "../LazyImage";

export default function KidsClassCard({ cls }) {
  const mainImage = cls.photoUrl 
    ? getFullImageUrl(cls.photoUrl)
    : "/img/kidsclass_default.jpg";

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
      <Link 
        to={`/kids-class/details/${cls.id}`}
        className="flex flex-col h-full"
      >
        <div className="relative h-[220px] overflow-hidden">
          <LazyImage
            src={mainImage}
            alt={cls.title}
            className="w-full h-full object-cover"
          />
        </div>

        <CardContent sx={{ flexGrow: 1, px: 3, pt: 3 }}>
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
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 cursor-help">{cls.title}</h3>
             </Tooltip>
             <p className="text-gray-500 text-xs font-medium">by {cls.instructorName}</p>
          </div>

          <div className="flex items-center gap-3 mb-4 text-gray-600 border-y border-gray-50 py-3">
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

          <div className="flex items-start gap-2">
             <img src="/location.svg" className="w-4 h-4 mt-0.5 opacity-60" alt="Location" />
             <div className="text-gray-500 text-sm font-medium leading-normal line-clamp-1">
               {cls.location_address || "Online / Hybrid"}
             </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
