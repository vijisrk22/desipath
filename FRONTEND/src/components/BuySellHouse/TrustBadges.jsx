import React from "react";
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';

function TrustBadges() {
  const badges = [
    {
      id: 1,
      title: "Verified Listings",
      icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 28, color: "#1565D8" }} />
    },
    {
      id: 2,
      title: "Updated Daily",
      icon: <UpdateOutlinedIcon sx={{ fontSize: 28, color: "#1565D8" }} />
    },
    {
      id: 3,
      title: "Community Trusted",
      icon: <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "#1565D8" }} />
    }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 py-6 md:py-8 shadow-sm relative z-20 -mt-6 rounded-t-3xl md:rounded-none md:-mt-0">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        {badges.map(badge => (
          <div key={badge.id} className="flex items-center gap-3">
            <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              {badge.icon}
            </div>
            <span className="text-[#1F2937] font-bold font-dmsans text-[17px]">
              {badge.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustBadges;
