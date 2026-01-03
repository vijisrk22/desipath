function SubscribeNewsletter() {
  return (
    <div className="p-8 bg-gray-200 rounded-2xl justify-start items-start gap-5 flex flex-wrap w-full">
      <div className=" text-gray-800 text-2xl font-bold font-dmsans capitalize leading-9 lg:basis-1/3">
        Subscribe to our news letter and get feed about all the events and
        services
      </div>
      <div className=" p-3 bg-white rounded-[14px] justify-start items-center gap-3 flex w-full lg:flex-1 flex-wrap">
        <div className="sm:grow sm:shrink sm:basis-0  px-7 py-3.5 bg-white rounded-lg border border-gray-300 justify-start items-center gap-2.5 flex w-full">
          <input
            type="email"
            className="grow shrink basis-0 text-gray-500 text-sm font-medium font-dmsans leading-tight outline-none"
            placeholder="Enter your Email"
          />
        </div>
        <div className=" px-7 pt-3.5 pb-2.5 bg-[#ffa41c] rounded-lg justify-center items-center gap-2.5 flex w-full md:w-auto ">
          <button className="text-gray-800 text-base font-medium font-dmsans leading-normal cursor-pointer hover:opacity-90 transition-opacity">
            Subcribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscribeNewsletter;
