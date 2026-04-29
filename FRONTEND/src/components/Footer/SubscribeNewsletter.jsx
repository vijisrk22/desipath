function SubscribeNewsletter() {
  return (
    <div className="p-8 bg-gray-200 rounded-2xl justify-between items-center gap-8 flex flex-col md:flex-row w-full max-w-7xl mx-auto">
      <div className="text-gray-800 text-[15px] font-medium font-dmsans leading-7 whitespace-nowrap">
        Subscribe to our newsletter and get updates about all the events and services
      </div>
      <div className="p-2 bg-white rounded-[14px] justify-end items-center gap-2 flex flex-wrap shrink-0">
        <div className="w-[200px] px-4 py-2.5 bg-white rounded-lg border border-gray-300 justify-start items-center flex">
          <input
            type="email"
            className="w-full text-gray-500 text-sm font-medium font-dmsans leading-tight outline-none"
            placeholder="Enter your Email"
          />
        </div>
        <div className="px-5 py-2.5 bg-[#ffa41c] rounded-lg justify-center items-center flex shrink-0">
          <button className="text-gray-800 text-sm font-bold font-dmsans leading-normal cursor-pointer hover:opacity-90 transition-opacity">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscribeNewsletter;
