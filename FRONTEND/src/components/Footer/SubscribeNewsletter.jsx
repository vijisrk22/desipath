function SubscribeNewsletter() {
  return (
    <div className="p-6 md:p-8 bg-gray-200 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
      {/* Heading text */}
      <p className="text-gray-800 text-sm md:text-[15px] font-medium font-dmsans leading-7 text-center md:text-left">
        Subscribe to our newsletter and get updates about all the events and
        services
      </p>

      {/* Input + Button */}
      <div className="w-full md:w-auto p-2 bg-white rounded-[14px] flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
        <div className="w-full sm:w-[220px] px-4 py-2.5 bg-white rounded-lg border border-gray-300 flex items-center">
          <input
            type="email"
            className="w-full text-gray-500 text-sm font-medium font-dmsans leading-tight outline-none"
            placeholder="Enter your Email"
          />
        </div>
        <button className="w-full sm:w-auto px-5 py-2.5 bg-[#ffa41c] rounded-lg text-gray-800 text-sm font-bold font-dmsans leading-normal cursor-pointer hover:opacity-90 active:scale-95 transition-all">
          Subscribe Now
        </button>
      </div>
    </div>
  );
}

export default SubscribeNewsletter;
