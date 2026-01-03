import ButtonRight from "../ButtonRight";

function CompanionCard({ text, path }) {
  return (
    <div
      className="max-w-[585px] min-h-64 rounded-[30px]"
      style={{
        background:
          "linear-gradient(227deg, rgba(255, 255, 255, 0) 0%, rgba(107, 114, 128, 0.6) 100%), linear-gradient(90deg, #5a9df5 0%, white 100%)",
        borderRadius: 30,
      }}
    >
      <div className="px-[18px] md:px-[36px] py-[29px] relative flex items-start gap-8">
        <img
          src="/img/travelCompanion/companionCardThumbnail.png"
          alt="Travel Companion"
          className="rounded-l-[30px]"
        />

        <div>
          <div className="text-gray-800  text-lg md:text-2xl font-semibold font-dmsans capitalize">
            {text}
          </div>
          <div className="w-full flex justify-end absolute bottom-4 right-5">
            <ButtonRight
              text=" Get Details"
              path={path}
              paddingClass="px-5 py-2 md:px-7 md:py-3"
              arrowVisible={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default CompanionCard;
