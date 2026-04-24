import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchButton from "./SearchButton";

function SearchAndFilter() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = category.toLowerCase().trim();

    // Smart routing for kids classes
    if (query.includes("keyboard")) {
      navigate("/kids-class/music/keyboard");
    } else if (query.includes("hindi")) {
      navigate("/kids-class/indian-languages/hindi");
    } else if (query.includes("math")) {
      navigate("/kids-class/academic-classes/maths");
    } else if (query.includes("veena")) {
      navigate("/kids-class/music/veena");
    } else if (query.includes("vocal")) {
      navigate("/kids-class/music/carnatic-vocal");
    } else if (query.includes("kids") || query.includes("class")) {
      navigate("/kids-class");
    } else {
      // Fallback or general search (could go to a general results page later)
      navigate("/kids-class");
    }
  };

  return (
    <div className=" py-4 max-w-2xl flex-col justify-start items-center gap-6 flex w-full mx-auto">
      <div className="text-center text-gray-800 text-[14px] xs:text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-medium font-dmsans md:leading-[36px]">
        New generation classifieds for <br />
        Desi people living abroad
      </div>

      <form 
        onSubmit={handleSearch}
        className=" h-[50px] flex justify-between bg-white border rounded-full border-gray-200 w-full px-[6px] py-[6px] shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex-1 flex justify-start items-center gap-2">
          {/* Location Input */}
          <div className="flex items-center px-4 border-r border-gray-200 w-[30%] sm:w-[35%]">
            <input
              type="text"
              placeholder="Zipcode/City"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-gray-800 text-xs sm:text-sm font-semibold font-dmsans outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Category Input */}
          <input
            type="text"
            placeholder="Search classes, cars, homes..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-gray-500 flex-1 text-xs sm:text-sm font-medium font-dmsans outline-none px-2 placeholder:text-gray-400"
          />
        </div>
        <SearchButton handleClick={handleSearch} />
      </form>
    </div>
  );
}

export default SearchAndFilter;
