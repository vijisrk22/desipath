import DisplayPath from "./DisplayPath";
import PostRoomForm from "./Roommates/PostRoomForm";
import PostHouseForm from "./BuySellHouse/PostHouseForm";
import PostRentalHomeForm from "./RentalHome/PostRentalHomeForm";
import PostCarForm from "./BuySellCar/PostCarForm";
import PostEventForm from "./Events/PostEventForm";

import SearchFieldInput from "./SearchFieldInput";

function ServiceTopBar({ inputs = [], title, paths, form, plainBg = false }) {
  const getBgImage = () => {
    if (title === "Buy a Car") return "url('/img/cars/backgroundCarImg.png')";
    if (title === "Rent a Home" || title === "Buy a home") return "url('/img/rentalHomes/rentalBanner.png')";
    return "url('/img/roommates/roommates-bg.png')";
  };

  return (
    <div className="px-[7%] relative  w-full">
      {!plainBg && (
        <div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]" 
            style={{ backgroundImage: getBgImage() }}
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-60 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]" />
        </div>
      )}

      <div className="relative z-20 flex justify-between items-center w-full">
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
                  href="/services/houses/sellHouse"
                  className="px-4 py-1.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-sm font-bold font-dmsans shadow-md"
                >
                  Post a House
                </a>
              )}
           </div>
        )}
      </div>
       <div className="mt-[10px] md:mt-[15px] lg:mt-[20px]">
        <div className="inline-flex h-[35px] md:h-[52px] px-8 md:px-10 relative rounded-t-2xl bg-white items-center shadow-sm">
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
        ) : null}
      </div>
    </div>
  );
}

export default ServiceTopBar;
