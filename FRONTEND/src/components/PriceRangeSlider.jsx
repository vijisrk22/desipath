import * as React from "react";
import Slider from "@mui/material/Slider";

const minDistance = 10;

export default function MinimumDistanceSlider({
  value,
  onChange,
  minRange,
  maxRange,
}) {
  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      onChange([Math.min(newValue[0], value[1] - minDistance), value[1]]);
    } else {
      onChange([value[0], Math.max(newValue[1], value[0] + minDistance)]);
    }
  };

  return (
    <div className="px-4 pt-1 pb-2 md:px-5 md:py-2 rounded-[25px] border border-gray-400 flex flex-col ">
      <div className="flex-1 flex justify-between items-center md:gap-12 lg:gap-20 xl:gap-24 flex-grow">
        <div className="relative text-gray-800 text-[15px] md:text-[10px] lg:text-[12px] xl:text-base font-medium font-dmsans">
          <span>Price </span>
        </div>
        <div className="relative text-gray-800 text-[15px] md:text-[10px] lg:text-[9px] xl:text-base font-normal font-dmsans">
          ${value[0]} - ${value[1]}
        </div>
      </div>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        disableSwap
        min={minRange}
        max={maxRange}
        sx={{
          color: "#FFA41C",
          "& .MuiSlider-thumb": { backgroundColor: "#FFA41C" },
          "& .MuiSlider-track": { backgroundColor: "#FFA41C" },
          "& .MuiSlider-rail": { backgroundColor: "#0857d0" },
        }}
      />
    </div>
  );
}
