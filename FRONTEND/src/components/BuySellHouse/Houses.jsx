import { Pagination } from "@mui/material";
import HouseCard from "./HouseCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";

import SortBy from "../SortBy";

import { searchHouse, fetchHouses } from "../../store/HousesSlice";

function Houses() {
  const dispatch = useDispatch();
  const { loading, error, houses, pagination, lastSearchQuery } = useSelector((state) => state.houses);
  
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at-desc");
  useEffect(() => {
    if (lastSearchQuery) {
      dispatch(searchHouse({ searchQuery: lastSearchQuery, page, sortOption }));
    } else {
      dispatch(fetchHouses({ page, sortOption }));
    }
  }, [dispatch, page, sortOption, lastSearchQuery]);

  const numsOfPage = pagination?.last_page || 1;

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
        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1); // Reset to page 1 on sort change
          }}
        />
      </div>

      <div className="flex justify-center items-center flex-wrap gap-4">
        {houses.map((house, index) => {
          return <HouseCard key={index} house={house} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {pagination?.current_page}-{numsOfPage.toString().padStart(2, "0")} of {pagination?.total} items
        </div>
        <Pagination
          count={numsOfPage}
          size="large"
          variant="outlined"
          shape="rounded"
          page={page}
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
