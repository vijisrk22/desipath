import React from "react";

function PopularLocations() {
  const locations = [
    { city: "Dallas", img: "/img/popular/dallas.jpg" },
    { city: "Austin", img: "/img/popular/austin.jpg" },
    { city: "Houston", img: "/img/popular/houston.jpg" },
    { city: "Atlanta", img: "/img/popular/atlanta.jpg" },
    { city: "Chicago", img: "/img/popular/chicago.jpg" },
    { city: "Seattle", img: "/img/popular/seattle.jpg" },
    { city: "New Jersey", img: "/img/popular/newjersey.jpg" },
    { city: "Toronto", img: "/img/popular/toronto.jpg" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-[36px] font-bold text-[#1F2937] font-dmsans tracking-tight">
          Popular Locations
        </h2>
        <p className="text-gray-600 font-medium font-dmsans mt-2">
          Explore top real estate markets across North America.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {locations.map((loc, idx) => (
          <div 
            key={idx} 
            className="group relative h-40 md:h-56 rounded-[20px] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Fallback background if image fails */}
            <div className="absolute inset-0 bg-blue-100" />
            
            {/* Background Image - we'll use a placeholder URL if the actual image doesn't exist */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('/modern_rental_home_hero.png')` }} 
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Text */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
              <span className="text-white font-bold font-dmsans text-xl md:text-2xl drop-shadow-md">
                {loc.city}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularLocations;
