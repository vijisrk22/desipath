import { useState } from "react";
import SearchButton from "./SearchButton";

function SearchAndFilter() {
  const [selectedValue, setSelectedValue] = useState("Location");

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  return (
    <div className=" py-[26px] max-w-screen-lg flex-col justify-start items-center gap-[36px] md:gap-[72px] flex xl:w-full">
      <div className="text-center text-gray-800  text-[20px] xs:text-[24px] sm-text[34px] md:text-[44px] lg:text-[54px] font-medium font-dmsans md:leading-[80px]">
        New generation classifieds for <br />
        Desi people living abroad
      </div>

      <div className=" h-[75px] flex justify-between bg-white border rounded-[36px] border-black-300 w-full px-[10px] py-[10px]">
        <div className="flex-1 flex justify-start items-center gap-4">
          <div className="relative flex items-center px-[10px] border-r border-gray-300 cursor-pointer">
            {/* Invisible select element that covers the entire div */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Select
                value={age}
                onChange={handleChange}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              <FormHelperText>Without label</FormHelperText>
            </FormControl> */}

            {/* Visible text */}
            <span className="text-gray-800  text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold font-dmsans">
              {selectedValue}
            </span>

            {/* Custom dropdown caret */}
            <img
              src="/caretDown.svg"
              className="w-[30px] h-[30px] pointer-events-none"
            />
          </div>

          <input
            placeholder="Select Category"
            className="text-gray-500 flex-1 text-sm sm:text-lg md:text-xl lg:text-2xl font-medium font-dmsans outline-none"
          />
        </div>
        <SearchButton />
      </div>
    </div>
  );
}

export default SearchAndFilter;
