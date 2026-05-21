import DisplayPath from "./DisplayPath";
import PostRoomForm from "./Roommates/PostRoomForm";
import PostHouseForm from "./BuySellHouse/PostHouseForm";
import PostRentalHomeForm from "./RentalHome/PostRentalHomeForm";
import PostCarForm from "./BuySellCar/PostCarForm";
import PostEventForm from "./Events/PostEventForm";
import PostPhotographyForm from "./Photography/PostPhotographyForm";

import SearchFieldInput from "./SearchFieldInput";

function ServiceTopBar({ inputs = [], title, paths, form, plainBg = false }) {
  const getBgImage = () => {
    if (title === "Buy a Car") return "url('/img/cars/backgroundCarImg.png')";
    if (title === "Rent a Home" || title === "Buy a home") return "url('/img/rentalHomes/rentalBanner.png')";
    if (title === "Photography & Videography") return "url('/img/photography/photographyBanner.png')";
    if (title === "Discover Top Astrologers") return "url('/img/astrology/hero.png')";
    if (title === "Find Your Dream Property") return "url('/img/realestate/realEstateBanner.png')";
    return "url('/img/roommates/roommates-bg.png')";
  };

  const isAstrology = title === "Discover Top Astrologers";
  const heightClass = isAstrology 
    ? "h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px]" // Reduced to ~60% of original
    : "h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]";

  return (
    <div className="px-[7%] relative  w-full">
      {!plainBg && (
        <div>
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${heightClass}`}
            style={{ backgroundImage: getBgImage() }}
          />
          {/* Dark Overlay */}
          <div className={`absolute inset-0 bg-black opacity-60 ${heightClass}`} />
        </div>
      )}

      <div className={`relative z-20 flex justify-between items-center w-full ${title === 'Find Your Dream Property' ? 'max-w-6xl mx-auto lg:px-8' : ''}`}>
        <div className="">
          {plainBg ? (
            <DisplayPath paths={paths} color="gray-500" />
          ) : (
            <DisplayPath paths={paths} />
          )}
        </div>
        
        {/* Top Right Action Button */}
        {form === undefined && inputs.length > 0 && (
           <div className="hidden md:block">
              {title === "Find a Room" && (
                <a
                  href="/services/roommates/postRoom"
                  className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans shadow-md"
                >
                  Post a Room
                </a>
              )}
              {title === "Rent a Home" && (
                <a
                  href="/services/rentalhomes/postRentalHome"
                  className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans shadow-md"
                >
                  Post Rental Home
                </a>
              )}
              {title === "Buy a Car" && (
                <a
                  href="/services/cars/sellCar"
                  className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans shadow-md"
                >
                  Sell a car
                </a>
              )}
              {title === "Buy a home" && (
                <a
                  href="/services/BuyHome/sellHouse"
                  className="text-[#ffa41c] hover:text-[#ff9900] text-[15px] font-bold font-dmsans underline decoration-2 underline-offset-4 transition-all whitespace-nowrap"
                >
                  Sell your Home - Free posting
                </a>
              )}
           </div>
        )}
      </div>
       <div className={`mt-[10px] md:mt-[15px] lg:mt-[20px] ${title === 'Find Your Dream Property' ? 'max-w-6xl mx-auto lg:px-8 w-full' : ''}`}>
        <div className="inline-flex h-[35px] md:h-[52px] px-8 md:px-10 relative rounded-t-2xl bg-white items-center shadow-sm ml-4 lg:ml-8">
          <div className="relative text-center text-[#007185] text-[12px] md:text-[15px] lg:text-[17px] xl:text-[18px] font-semibold font-dmsans">
            {title}
          </div>
        </div>

        {/* Searchbar */}
        {inputs.length > 0 ? (
          <SearchFieldInput inputs={inputs} title={title} />
        ) : form === "room" ? (
          <PostRoomForm />
        ) : form === "house" ? (
          <PostHouseForm />
        ) : form === "rentalHome" ? (
          <PostRentalHomeForm />
        ) : form === "car" ? (
          <PostCarForm />
        ) : form === "event" ? (
          <PostEventForm />
        ) : form === "photography" ? (
          <PostPhotographyForm />
        ) : null}
      </div>
    </div>
  );
}

export default ServiceTopBar;
