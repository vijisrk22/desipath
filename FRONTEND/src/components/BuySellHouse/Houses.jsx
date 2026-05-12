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
    const savedLocation = localStorage.getItem('user_location');

    if (lastSearchQuery) {
      dispatch(searchHouse({ searchQuery: lastSearchQuery, page, sortOption }));
    } else if (!savedLocation) {
      dispatch(fetchHouses({ page, sortOption }));
    }
  }, [dispatch, page, sortOption]); // Removed lastSearchQuery to prevent infinite loops

  const numsOfPage = pagination?.last_page || 1;

  if (loading) {
    return <Loader />;
  }

  console.log(houses);

  return (
    <div className="px-[7%] mt-6 mb-20">
      <div className="mb-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100/50">
        <div className="text-[#007185] text-[32px] md:text-[40px] font-bold font-dmsans">
          Property Listings
        </div>
        <SortBy
          sortOption={sortOption}
          type="house"
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1); // Reset to page 1 on sort change
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {houses.length > 0 ? (
          houses.map((house, index) => (
            <HouseCard key={index} house={house} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No houses found matching your criteria.
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between gap-8 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans whitespace-nowrap">
          Showing {pagination?.from || 0}-{pagination?.to || 0} of {pagination?.total || 0} properties
        </div>
        <Pagination
          count={numsOfPage}
          size="medium"
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={(event, value) => setPage(value)}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              borderColor: "#e5e7eb",
              borderRadius: "8px",
              fontWeight: "600",
              fontFamily: "DM Sans, sans-serif",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#ffa41c",
              color: "white",
              borderColor: "#ffa41c",
              "&:hover": {
                backgroundColor: "#e69419",
              },
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast": {
              backgroundColor: "#f9fafb",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Houses;
