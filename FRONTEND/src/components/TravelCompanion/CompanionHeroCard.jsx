import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

function CompanionHeroCard({ personType }) {
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-between gap-8 px-10 py-[30px] bg-white rounded-2xl shadow-md">
      <div className="flex-1">
        {/* From City - To City */}
        <div className="flex items-center gap-4">
          <div className="text-gray-800 text-xl font-semibold font-dmsans">
            {personType.fromCity} {personType.fromAirport}
          </div>

          <div className="flex justify-between items-center relative w-full">
            <img
              src="/img/travelCompanion/ellipseFilled.svg"
              className="w-6 h-6"
            />

            <div className="relative flex-1 flex items-center justify-center mx-2">
              <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 border-t border-dotted border-gray-400 z-0" />
              <div className="bg-[#FFA41C] rounded-full p-2 z-10">
                <img
                  src="/img/travelCompanion/flight.svg"
                  className="w-4 h-4"
                />
              </div>
            </div>

            <img
              src="/img/travelCompanion/ellipseOutline.svg"
              className="w-6 h-6"
            />
          </div>

          <div className="text-gray-800 text-xl font-semibold font-dmsans">
            {personType.toCity} {personType.toAirport}
          </div>
        </div>

        {/* Flight Details */}

        <div className="flex items-center justify-between mt-4">
          {/* Date */}
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-gray-400 text-xl font-medium font-dmsans">
              Date
            </div>
            <div className="text-gray-800 text-xl font-semibold font-dmsans">
              {personType.travelDate}
            </div>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-gray-400 text-xl font-medium font-dmsans">
              IST
            </div>
            <div className="text-gray-800 text-xl font-semibold font-dmsans">
              {personType.departureTime}
            </div>
          </div>

          {/* Travel Companion */}
          <div className="flex flex-col gap-2 justify-center items-center">
            <div className="text-gray-400 text-xl font-medium font-dmsans">
              Travel Companion
            </div>
            <div className="text-gray-800 text-xl font-semibold font-dmsans">
              {personType.travelCompanionGift}
            </div>
          </div>
        </div>
      </div>

      <button className="px-5 py-2.5 text-white rounded-[57px] inline-flex justify-center items-center gap-2.5 bg-[#0857D0]">
        <div className="justify-end text-base font-bold font-dmsans">
          Chat with Travel Companion
        </div>
        <SmsOutlinedIcon />
      </button>
    </div>
  );
}

export default CompanionHeroCard;
