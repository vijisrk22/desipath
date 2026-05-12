import FavoriteIcon from "@mui/icons-material/Favorite";
import api from "../../utils/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoSpeedometerOutline } from "react-icons/io5";
import { MdLocalGasStation } from "react-icons/md";
import { TbManualGearbox } from "react-icons/tb";
import LazyImage from "../LazyImage";
import { getStateCode } from "../../utils/locationHelper";
import { generateRandomSuffix } from "../../utils/urlHelper";

export default function CarCard({ car }) {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Link
      to={car?.id ? `/services/cars/buyCar/${car.id}-${generateRandomSuffix(car.id)}` : "#"}
      className="group block bg-white rounded-[30px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden h-full flex flex-col w-full relative"
      style={{ minHeight: "450px", maxWidth: "350px" }}
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsFavorited(!isFavorited);
        }}
        className="absolute z-10 top-3 right-4 flex items-center justify-center bg-white/40 p-2 rounded-full shadow-md hover:bg-white/60 transition-colors"
      >
        {isFavorited ? (
          <FavoriteIcon sx={{ width: "1.5rem", height: "1.5rem", color: "red" }} />
        ) : (
          <img src="/heart.svg" alt="heart" className="w-6 h-6" />
        )}
      </button>

      <div className="w-full h-[300px] p-2 overflow-hidden shrink-0">
        <LazyImage
          src={
            car?.pictures && Array.isArray(car.pictures) && car.pictures.length > 0
              ? `${api.defaults.baseURL}/${car.pictures[0]}`
              : "https://via.placeholder.com/167"
          }
          alt={`${car?.make || "Car"} ${car?.model || ""}`}
          className="w-full h-full object-cover rounded-[20px] group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://via.placeholder.com/167";
          }}
        />
      </div>

      <div className="px-5 py-3 flex flex-col flex-grow bg-white">
        <div className="text-blue-700 text-lg font-semibold font-dmsans truncate">
          {String(typeof car?.make === 'object' ? (car.make?.name || car.make?.make || JSON.stringify(car.make)) : (car?.make || "Unknown Make"))} {String(typeof car?.model === 'object' ? (car.model?.name || car.model?.model || JSON.stringify(car.model)) : (car?.model || "Model"))} – {String(typeof car?.year === 'object' ? (car.year?.name || JSON.stringify(car.year)) : (car?.year || "N/A"))}
        </div>

        <div className="text-gray-800 text-sm font-normal font-dmsans truncate mt-1 mb-2">
          {typeof car?.description === 'object' ? JSON.stringify(car.description) : (car?.description || "No description provided.")}
        </div>

        {/* Location Section */}
        <div className="flex items-center gap-1.5 mb-3">
          <img src="/location.svg" className="w-3.5 h-3.5 opacity-50" alt="location" />
          <div className="text-gray-500 text-[12px] font-medium font-dmsans truncate">
            {typeof car.location_city === 'object' ? (car.location_city?.name || "") : car.location_city}, {getStateCode(typeof car.location_state === 'object' ? car.location_state?.name : car.location_state)}
          </div>
        </div>

        <div className="border-t border-gray-200 py-2.5 flex justify-between items-center w-full">
          <div className="flex flex-col items-center gap-2">
            <IoSpeedometerOutline className="w-5 h-5 text-gray-400" />
            <div className="text-gray-800 text-sm font-normal font-dmsans">
              {String(car?.miles && typeof car.miles === 'object' ? (car.miles.name || JSON.stringify(car.miles)) : (car?.miles ? `${car.miles.toLocaleString()} mi` : "N/A"))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <MdLocalGasStation className="w-5 h-5 text-gray-400" />
            <div className="text-gray-800 text-sm font-normal font-dmsans">
              {String(typeof car?.fuel_type === 'object' ? (car.fuel_type?.name || JSON.stringify(car.fuel_type)) : (car?.fuel_type || "Gasoline"))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <TbManualGearbox className="w-5 h-5 text-gray-400" />
            <div className="text-gray-800 text-sm font-normal font-dmsans">
              {String(typeof car?.transmission_name === 'object' ? (car.transmission_name?.name || JSON.stringify(car.transmission_name)) : (car?.transmission_name || "N/A"))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="text-gray-800 text-xl font-bold font-dmsans">
            ${String(car?.price && typeof car.price === 'object' ? (car.price.name || JSON.stringify(car.price)) : (car?.price ? car.price.toLocaleString() : "0"))}
          </div>
        </div>
      </div>
    </Link>
  );
}

