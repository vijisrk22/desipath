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
    <div className="px-[7%] mt-12 mb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#007185] text-[32px] md:text-[40px] font-bold font-dmsans">
          Property Listings
        </div>
        <SortBy
          sortOption={sortOption}
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

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {pagination?.from || 0}-{pagination?.to || 0} of {pagination?.total || 0} properties
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
