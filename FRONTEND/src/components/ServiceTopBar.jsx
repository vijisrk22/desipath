import DisplayPath from "./DisplayPath";
import PostRoomForm from "./Roommates/PostRoomForm";
import PostHouseForm from "./BuySellHouse/PostHouseForm";
import PostRentalHomeForm from "./RentalHome/PostRentalHomeForm";
import PostCarForm from "./BuySellCar/PostCarForm";
import PostEventForm from "./Events/PostEventForm";

import SearchFieldInput from "./SearchFieldInput";

function ServiceTopBar({ inputs = [], title, paths, form, plainBg = false }) {
  return (
    <div className="px-[7%] relative  w-full">
      {!plainBg && (
        <div>
          <div className="absolute inset-0 bg-[url('/img/roommates/roommates-bg.png')] bg-cover bg-center bg-no-repeat h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]" />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-60 h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]" />
        </div>
      )}

      <div className="relative z-20 ">
        {plainBg ? (
          <DisplayPath paths={paths} color="gray-500" />
        ) : (
          <DisplayPath paths={paths} />
        )}
      </div>
      <div className="mt-[32px] md:mt-[64px] lg:mt-[96px]">
        <div className="w-[40%] h-[40px] md:h-[85px] relative rounded-t-2xl bg-white flex items-center">
          <div className="relative text-center flex-grow  text-[#007185] text-[25px] md:text-[27px] lg:text-[30px] xl:text-[40px] font-semibold font-dmsans truncate mx-2">
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
