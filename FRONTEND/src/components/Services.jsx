import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeadings from "./SectionHeadings";
import LazyImage from "./LazyImage";

const services = [
  {
    name: "Rental home",
    image: "/img/services/Desipath_rental_home.jpeg",
    path: "/services/rentalhomes",
  },
  {
    name: "Buy/Sell Cars",
    image: "/img/services/buysellcar_Desipath.jpeg",
    path: "/services/cars",
  },
  {
    name: "Kids class",
    image: "/img/services/Desipath_KidsClass.jpeg",
    path: "/kids-class",
  },
  {
    name: "Buy Sell Home",
    image: "/img/services/BuysellHome_Desipath.jpeg",
    path: "/services/BuyHome",
  },
  {
    name: "Travel Companion",
    image: "/img/services/Desipath_Travelcompanion.jpeg",
    path: "/travel-companion",
  },
  {
    name: "Events",
    image: "/img/services/Desipath_Events.jpeg",
    path: "/events",
  },
  {
    name: "Roommates",
    image: "/img/services/Roommates_Desipath.jpeg",
    path: "/services/roommates",
  },
  {
    name: "IT Trainings",
    image: "/img/services/ITTraining_Desipath.jpeg",
    path: "/it-training",
  },
  {
    name: "Desi Attorneys",
    image: "/img/services/Attorney_Desipath.jpeg",
    path: "/desi-attorneys",
  },
  {
    name: "Doctors",
    image: "/img/services/Doctors_Desipath.jpeg",
    path: "/desi-doctors",
  },
  {
    name: "Astrology",
    image: "/img/services/Desipath_Astrologers.jpeg",
    path: "/astrologer/find",
  },
  {
    name: "Local Deals",
    image: "/img/services/Desipath_LocalAds.jpeg",
    path: "/services/Localdeals",
    tooltip: "Explore exclusive local offers on dining, shopping, and a wide range of services near you."
  },
  {
    name: "Photography",
    image: "/img/services/Desipath_Photography.jpeg",
    path: "/services/photography",
  },
  {
    name: "Real Estate (Dubai/India)",
    image: "/img/services/RealEstate_Desipath.png",
    path: "/real-estate/find",
  },
  {
    name: "Desi News",
    image: "/img/services/Immigration_Desipath.jpeg",
    path: "/daily-news",
  },
  {
    name: "Jobs",
    image: "/img/services/Desipath_jobs.jpeg",
    path: "/jobs",
    tooltip: "Land your next opportunity! Explore IT jobs, blue collar roles, or connect with someone who can refer you in."
  },
  {
    name: "Forum",
    image: "/img/services/Desipath_Forum.png",
    path: "/forum",
  },
  {
    name: "Buy/Sell Items",
    image: "/img/services/Desipath_Buysell_items.png",
    path: "/buy-sell-items",
  },
  {
    name: "Ride Share",
    image: "/img/services/Desipath_RideShare.png",
    path: "/rides",
  },
  {
    name: "Finance/invest/Tax",
    image: "/img/services/Desipath_Finance.png",
    path: "/financial-advisors",
  },
];

// generate a circular SVG placeholder with initials as a data URL
function makePlaceholder(text, size = 167) {
  const initials = text
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = "#E5E7EB"; // gray-200
  const color = "#6B7280"; // gray-500
  const fontSize = Math.floor(size / 3);
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='100%' height='100%' rx='${size / 2}' ry='${size / 2}' fill='${bg}' />
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='${fontSize}' fill='${color}'>${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ServicesSection() {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      {/* Services heading removed as per user request */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 lg:gap-10 xl:gap-12 max-w-6xl mx-auto px-4 md:px-8 w-full justify-items-center">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center gap-3 relative"
            onMouseEnter={() => service.tooltip && setActiveTooltip(index)}
            onMouseLeave={() => setActiveTooltip(null)}
          >
            {service.tooltip && activeTooltip === index && (
              <div 
                className="absolute bottom-[115%] left-1/2 -translate-x-1/2 z-35 w-64 bg-slate-900/95 backdrop-blur-md border border-blue-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.25),0_0_15px_rgba(59,130,246,0.15)] p-4 rounded-2xl pointer-events-none animate-tooltip"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 font-dmsans">
                      Discovery
                    </span>
                  </div>
                  <p className="text-xs text-slate-100 leading-relaxed font-semibold font-dmsans text-left">
                    {service.tooltip}
                  </p>
                </div>
                {/* Arrow */}
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-900 border-r border-b border-blue-500/20 rotate-45"></div>
              </div>
            )}
            <Link
              to={service.path}
              // ensure a fixed circular container so images render with the expected size
              className="rounded-full overflow-hidden flex justify-center items-center cursor-pointer w-[72px] h-[72px] md:w-[84px] md:h-[84px] lg:w-[100px] lg:h-[100px] hover:shadow-lg transition-all"
            >
              <LazyImage
                className="w-full h-full object-cover"
                src={service.image}
                alt={service.name}
                onError={(e) => {
                  // replace broken image with generated SVG placeholder
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = makePlaceholder(service.name, 167);
                }}
              />
            </Link>
            <div className="text-center text-gray-800 text-sm md:text-base font-normal font-dmsans">
              {service.name}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes tooltipFade {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-tooltip {
          animation: tooltipFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
