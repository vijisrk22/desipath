import React from "react";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ChecklistRtlOutlinedIcon from '@mui/icons-material/ChecklistRtlOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

function BuyerResources() {
  const resources = [
    {
      title: "How to Buy Your First Home",
      desc: "A complete step-by-step guide for first-time buyers in the current market.",
      icon: <HomeOutlinedIcon sx={{ fontSize: 40, color: "#1565D8" }} />
    },
    {
      title: "Mortgage Calculator",
      desc: "Estimate your monthly payments, including taxes and insurance.",
      icon: <CalculateOutlinedIcon sx={{ fontSize: 40, color: "#1565D8" }} />
    },
    {
      title: "Home Buying Checklist",
      desc: "Everything you need to prepare before making an offer on a house.",
      icon: <ChecklistRtlOutlinedIcon sx={{ fontSize: 40, color: "#1565D8" }} />
    },
    {
      title: "Financing Guide",
      desc: "Learn about different loan types and how to get pre-approved quickly.",
      icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 40, color: "#1565D8" }} />
    }
  ];

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="text-[36px] font-bold text-[#1F2937] font-dmsans tracking-tight">
            Buyer Resources
          </h2>
          <p className="text-gray-600 font-medium font-dmsans mt-2 max-w-2xl mx-auto">
            Everything you need to navigate the home buying process with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((res, idx) => (
            <div 
              key={idx}
              className="bg-[#F8FAFC] border border-[#E5E7EB] p-8 rounded-[24px] hover:shadow-lg transition-shadow duration-300 flex flex-col items-start"
            >
              <div className="bg-white w-16 h-16 rounded-full shadow-sm flex items-center justify-center mb-6">
                {res.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] font-dmsans mb-3">
                {res.title}
              </h3>
              <p className="text-gray-600 font-medium font-dmsans mb-6 flex-grow">
                {res.desc}
              </p>
              <button className="text-[#1565D8] font-bold font-dmsans hover:underline">
                Learn More &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BuyerResources;
