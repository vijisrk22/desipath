import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";

function CompanionHeroCard({ personType }) {
  return (
    <div className="w-full max-w-[400px] h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl">
      <div className="flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col items-center flex-1">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">From</span>
            <div className="text-[#007185] text-lg font-bold font-dmsans text-center leading-tight">
              {personType.fromCity}
              <div className="text-gray-400 text-xs font-medium uppercase mt-1">({personType.fromAirport})</div>
            </div>
          </div>

          <div className="flex-[0.5] flex flex-col items-center justify-center px-2">
             <div className="w-full border-t border-dotted border-gray-300 relative flex justify-center">
                <div className="absolute top-[-10px] bg-white p-1 rounded-full border border-gray-50 flex items-center justify-center z-10 shadow-sm transition-transform hover:scale-110">
                   <img src="/img/travelCompanion/flight.svg" className="w-3.5 h-3.5 text-[#ffa41c]" style={{ filter: 'invert(75%) sepia(50%) saturate(1000%) hue-rotate(350deg)' }} />
                </div>
             </div>
          </div>

          <div className="flex flex-col items-center flex-1">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">To</span>
            <div className="text-[#007185] text-lg font-bold font-dmsans text-center leading-tight">
              {personType.toCity}
              <div className="text-gray-400 text-xs font-medium uppercase mt-1">({personType.toAirport})</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Travel Date</div>
            <div className="text-gray-700 text-sm font-bold font-dmsans">
              {personType.travelDate}
            </div>
          </div>
          <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-50">
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Gift/Fee</div>
            <div className="text-[#ffa41c] text-sm font-extrabold font-dmsans">
              {personType.travelCompanionGift || "Discuss"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-3">
        <button className="w-full px-5 py-3 text-white rounded-xl inline-flex justify-center items-center gap-2.5 bg-[#007185] hover:bg-[#005a6a] transition-all font-bold text-sm shadow-sm">
          Chat Now
          <SmsOutlinedIcon sx={{ fontSize: '1.1rem' }} />
        </button>
      </div>
    </div>
  );
}

export default CompanionHeroCard;
