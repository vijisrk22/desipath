import { Pagination } from "@mui/material";
import HouseCard from "./HouseCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";

import { fetchHouses } from "../../store/HousesSlice";

function Houses() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, houses } = useSelector((state) => state.houses);
  const housesPerPage = 9;
  const numsOfPage = Math.ceil(houses.length / housesPerPage);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * housesPerPage;
  const displayedHouses = houses.slice(startIndex, startIndex + housesPerPage);

  // Set houses on mount
  useEffect(() => {
    dispatch(fetchHouses());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  console.log(houses);

  return (
    <div className="px-[7%] mt-20">
      <div className=" mb-6  flex justify-between items-center">
        <div className="text-[#007185] text-[40px] font-medium font-dmsans">
          Home
        </div>
        <div className=" text-gray-500 text-[22px] font-semibold font-dmsans flex gap-1">
          Sort by
          <button>
            <img src="/caretDown.svg" />
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center flex-wrap gap-4">
        {displayedHouses.map((house, index) => {
          return <HouseCard key={index} house={house} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of {houses.length}{" "}
          items
        </div>
        <Pagination
          count={numsOfPage}
          size="large"
          variant="outlined"
          shape="rounded"
          onChange={(event, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-page": {
              mx: "12px", // Adds spacing between page numbers
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c", // Sets the background color for the selected page
              color: "white", // Ensures text is visible
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#ffa41c", // Sets color for ellipsis (...)
              fontWeight: "bold",
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast":
              {
                color: "#ffa41",
                mx: "16px",
              },
          }}
        />
      </div>
    </div>
  );
}

export default Houses;
