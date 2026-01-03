import { Link } from "react-router-dom";
import SectionHeadings from "./SectionHeadings";

const services = [
  {
    name: "Rental home",
    image: "/img/rentalHomes/rentalHome1.png",
    path: "/services/rentalHomes",
  },
  {
    name: "Buy/Sell Cars",
    image: "/img/cars/carThumbnail.png",
    path: "/services/cars",
  },
  {
    name: "Kids class",
    image: "/img/kidsClass/kidsClass.png",
    path: "",
  },
  {
    name: "Buy sell house",
    image: "/img/houses/house1.png",
    path: "/services/houses",
  },
  {
    name: "Travel Companion",
    image: "/img/travelCompanion/companionCardThumbnail.png",
    path: "/services/travelCompanion",
  },
  {
    name: "Events",
    image: "/img/events/eventSmpl1.png",
    path: "/services/events",
  },
  {
    name: "Roommates",
    image: "/img/roommates/roomThumb.png",
    path: "/services/roommates",
  },
  {
    name: "IT Trainings",
    image: "/img/itTrainings/coursesThumbnail.png",
    path: "/services/itTrainings",
  },
  {
    name: "Lawyers",
    image: "/img/lawyers/lawyers.png",
    path: "",
  },
  {
    name: "Doctors",
    image: "/img/doctors/doctors.png",
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
      <SectionHeadings heading="Services" />
      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-12 xl:gap-16">
        {services.map((service, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <Link
              to={service.path}
              // ensure a fixed circular container so images render with the expected size
              className="rounded-full overflow-hidden flex justify-center items-center cursor-pointer w-[167px] h-[167px]"
            >
              <img
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
            <div className="text-center text-gray-800 text-xl font-semibold font-dmsans">
              {service.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
