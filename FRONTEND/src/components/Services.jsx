import { Link } from "react-router-dom";
import SectionHeadings from "./SectionHeadings";
import LazyImage from "./LazyImage";

const services = [
  {
    name: "Rental home",
    image: "/img/rentalHomes/rentalHome1.png",
    path: "/services/rentalhomes",
  },
  {
    name: "Buy/Sell Cars",
    image: "/img/cars/carThumbnail.png",
    path: "/services/cars",
  },
  {
    name: "Kids class",
    image: "/img/kidsClass/kidsClass.png",
    path: "/kids-class",
  },
  {
    name: "Buy Sell Home",
    image: "/img/houses/buy_sell_house_icon.png",
    path: "/services/BuyHome",
  },
  {
    name: "Travel Companion",
    image: "/img/travelCompanion/travelCompanionIcon.jpg",
    path: "/travel-companion",
  },
  {
    name: "Events",
    image: "/img/events/Desipath_Events.png",
    path: "/services/events",
  },
  {
    name: "Roommates",
    image: "/img/roommates/Desipath_Roommates.png",
    path: "/services/roommates",
  },
  {
    name: "IT Trainings",
    image: "/img/itTrainings/Desipath_ITTraining.png",
    path: "/it-training",
  },
  {
    name: "Lawyers",
    image: "/img/lawyers/Attorney.png",
    path: "",
  },
  {
    name: "Doctors",
    image: "/img/doctors/Desipath_Doctors.png",
    path: "",
  },
  {
    name: "Astrology",
    image: "/img/astrology/Desipath_Astrologers.png",
    path: "/services/astrologyAds",
  },
  {
    name: "Local Deals",
    image: "/img/localAds/Desipath_Local_Ads.png",
    path: "/services/Localdeals",
  },
  {
    name: "Photography",
    image: "/img/photography/Desipath_Photography.png",
    path: "/services/photography",
  },
  {
    name: "Immigration",
    image: "/img/immigration/Desipath_Immigration.png",
    path: "",
  },
  {
    name: "Jobs",
    image: "/img/jobs/Desipath_jobs.png",
    path: "",
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
  return (
    <div className="flex flex-col justify-start items-center gap-[24px]">
      {/* Services heading removed as per user request */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 lg:gap-12 xl:gap-16">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <Link
              to={service.path}
              // ensure a fixed circular container so images render with the expected size
              className="rounded-full overflow-hidden flex justify-center items-center cursor-pointer w-[84px] h-[84px] md:w-[98px] md:h-[98px] lg:w-[116px] lg:h-[116px]"
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
    </div>
  );
}
