import React from "react";
import { useSelector } from "react-redux";
import HouseCard from "./HouseCard";

function FeaturedHomes() {
  const { houses, loading } = useSelector((state) => state.houses);

  // Take up to 4 houses for featured section
  const featuredHouses = houses?.slice(0, 4) || [];

  if (loading || featuredHouses.length === 0) {
    return null; // Don't show the section if loading or no houses
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-16 bg-[#F8FAFC]">
      <div className="mb-10 flex flex-col items-center text-center md:flex-row md:justify-between md:text-left md:items-end">
        <div>
          <h2 className="text-[36px] font-bold text-[#1F2937] font-dmsans tracking-tight">
            Featured Homes Near You
          </h2>
          <p className="text-gray-600 font-medium font-dmsans mt-2">
            Hand-picked listings based on popular searches.
          </p>
        </div>
        <button className="hidden md:inline-flex mt-4 md:mt-0 text-[#1565D8] font-bold font-dmsans hover:underline">
          View All Featured &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredHouses.map((house, index) => (
          <HouseCard key={index} house={house} />
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <button className="text-[#1565D8] font-bold font-dmsans hover:underline">
          View All Featured &rarr;
        </button>
      </div>
    </div>
  );
}

export default FeaturedHomes;
