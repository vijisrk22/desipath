import ButtonRight from "../ButtonRight";

function CompanionCard({ text, path }) {
  return (
    <div className="w-full h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between transition-all duration-200 hover:translate-y-[-4px] hover:shadow-xl">
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 flex-shrink-0 bg-sky-50 rounded-2xl flex items-center justify-center">
          <img
            src="/img/travelCompanion/companionCardThumbnail.png"
            alt="Travel Companion"
            className="w-14 h-14 object-contain"
          />
        </div>
        <div className="flex-1">
          <div className="text-[#007185] text-lg font-bold font-dmsans leading-tight mb-4">
            {text}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <ButtonRight
          text="Get Details"
          path={path}
          paddingClass="px-6 py-2.5"
          arrowVisible={false}
          textClass="text-sm font-bold"
        />
      </div>
    </div>
  );
}
export default CompanionCard;
