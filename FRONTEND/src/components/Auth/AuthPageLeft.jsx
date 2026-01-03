function AuthPageLeft() {
  return (
    <div className="flex flex-col items-center md:items-start md:ml-[100px] lg:ml-[175px] md:mt-[32.5px] md:mr-[105px] md:mb-[612px] text-center md:text-left">
      <div className="text-[#0857d0] text-3xl font-normal font-fredoka">
        Desipath
      </div>

      <div className="mt-6 text-start md:mt-[145.5px] flex flex-col gap-6">
        <div className="text-[#fb9400] hidden md:grid md:text-[30px] lg:text-[40px] font-medium font-poppins leading-relaxed">
          Easy way to interact with Desi!
        </div>
        <div className="text-[#fb9400] text-2xl md:hidden font-medium font-poppins leading-relaxed">
          New generation classifieds for Desi !
        </div>

        <div className="text-[#141718] hidden md:block text-base font-normal font-inter leading-relaxed max-w-xl">
          Find local services, Roommates, Buy & Sell Home, Rental home, Find
          Travel companion for your parents or Be a travel companion and get
          Gift cards, Find Local doctors/ Attorneys, Find IT trainings, Browse
          local events etc.
        </div>
      </div>
    </div>
  );
}

export default AuthPageLeft;
