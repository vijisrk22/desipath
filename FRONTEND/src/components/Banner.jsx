function Banner() {
  return (
    <div className="flex justify-center mt-[50px] mx-auto max-w-screen-xl">
      <div
        className="relative bg-[#003459] rounded-[20px] overflow-hidden flex justify-center items-center px-6 md:px-12 w-full"
        style={{ height: "30vw", maxHeight: "420px" }}
      >
        {/* Background Elements */}
        <div
          className="absolute bg-[#f3f5f7] rounded-[99px] origin-top-left rotate-[25.23deg]"
          style={{
            width: "80vw",
            height: "65vw",
            left: "42vw",
            top: "-19vw",
            maxWidth: "782px",
            maxHeight: "635px"
          }}
        />
        <div
          className="absolute bg-gray-200 rounded-[99px] origin-top-left rotate-[28.25deg]"
          style={{
            width: "90vw",
            height: "90vw",
            left: "2vw",
            top: "1vw",
            maxWidth: "787px",
            maxHeight: "787px"
          }}
        />

        {/* Text & Content */}
        <div className="relative flex flex-col justify-end items-end md:items-end text-center md:text-right gap-2 z-10 w-full">
          <div className="text-gray-800 text-2xl md:text-4xl lg:text-5xl font-bold font-dmsans capitalize">
            Your journey starts here
          </div>
          <div className="text-gray-800 text-xl md:text-3xl lg:text-4xl font-semibold font-dmsans capitalize">
            Because you deserve more!
          </div>
          <p className="text-gray-500 text-xs md:text-sm lg:text-base font-medium font-dmsans max-w-[80%] md:max-w-[394px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <div className="mt-6 flex gap-4 z-10">
            <button className="px-5 md:px-7 py-2.5 border-2 border-gray-800 rounded-[57px] text-gray-800 text-sm md:text-base font-medium flex items-center gap-2">
              View Intro
              <img src="/playCircle.png" className="w-4 md:w-6 h-4 md:h-6" />
            </button>
            <button className="px-5 md:px-7 py-2.5 bg-[#ffa41c] rounded-[57px] text-gray-800 text-sm md:text-base font-medium flex items-center gap-2">
              Explore Now
              <img src="/caretRight.png" className="w-4 md:w-6 h-4 md:h-6" />
            </button>
          </div>
          {/* Banner Image */}
          <img
            className="absolute w-[70%] md:w-[600px] lg:w-[633px] h-auto left-[-30%] md:left-[-50px] -top-28"
            src="/bannerImg.png"
          />
        </div>
      </div>
    </div>
  );
}

export default Banner;
