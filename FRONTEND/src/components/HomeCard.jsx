function HomeCard({ home }) {
  return (
    <div className="h-[304px] px-2.5 pt-2.5 pb-4 bg-white rounded-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] flex-col justify-start items-start gap-2 inline-flex">
      <img
        className="w-[340px] h-[180px] rounded-[20px]"
        src={home.imageSrc}
        alt="Home"
      />
      <div className="h-[90px] flex-col justify-start items-start gap-2 inline-flex">
        <div className="h-[26px] justify-start items-center gap-2 inline-flex">
          <img src="/dollar.svg" className="w-[24px] h-[24px]" />
          <div className="text-gray-800 text-xl font-semibold font-['DM_Sans'] capitalize">
            {home.price}
          </div>
        </div>
        <div className="h-6 justify-start items-center gap-2 inline-flex">
          <img src="/location.svg" className="w-[24px] h-[24px]" />
          <div className="text-gray-500 text-sm font-medium font-['DM_Sans'] capitalize">
            {home.location}
          </div>
        </div>
        <div className="h-6 justify-start items-center gap-2 inline-flex">
          <img src="/mageHome.svg" className="w-[24px] h-[24px]" />
          <div className="text-gray-500 text-sm font-medium font-dmsans">
            {home.type}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCard;
