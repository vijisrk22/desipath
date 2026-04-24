import { Pagination } from "@mui/material";
import RentalHomeCard from "./RentalHomeCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { searchRentalHome, fetchRentalHomes } from "../../store/RentalHomesSlice";

function RentalHomesList() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, rentalHomes, pagination, lastSearchQuery } = useSelector(
    (state) => state.rentalHomes
  );

  // const roomsPerPage = 9; // Handled by backend now
  // const [page, setPage] = useState(1); // We can still use local state or use pagination.current_page

  // Sync page state with pagination from store if needed, or just rely on local page state to trigger fetch
  const [page, setPage] = useState(1);

  console.log(rentalHomes);

  const [sortOption, setSortOption] = useState("created_at-desc");

  // Client-side sort is removed, now we pass sortOption to backend
  // const getSortedRentalHomes = () => { ... }

  // const sortedRentalHomes = getSortedRentalHomes();
  // const numsOfPage = Math.ceil(rentalHomes.length / roomsPerPage);
  // const displayedRooms = sortedRentalHomes.slice(...)

  // Fetch rentalHomes on mount and when page or sort parameters change
  useEffect(() => {
    if (lastSearchQuery) {
      dispatch(searchRentalHome({ searchQuery: lastSearchQuery, page, sortOption }));
    } else {
      dispatch(fetchRentalHomes({ page, sortOption }));
    }
  }, [dispatch, page, sortOption, lastSearchQuery]);

  const numsOfPage = pagination?.last_page || 1;

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="px-[7%] mt-12 mb-20">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[#007185] text-[16px] md:text-[20px] font-bold font-dmsans uppercase tracking-wide">
          Rental Listings
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
        {rentalHomes.length > 0 ? (
          rentalHomes.map((rentalHome, index) => (
            <RentalHomeCard key={index} rentalHome={rentalHome} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No rental homes found matching your criteria.
          </div>
        )}
      </div>

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {pagination?.current_page || 1}-{pagination?.last_page || 1} of {pagination?.total || 0} homes
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
              backgroundColor: "#0857d0", // Sets the background color for the selected page
              color: "white", // Ensures text is visible
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#0857d0", // Sets color for ellipsis (...)
              fontWeight: "bold",
            },
            "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast":
            {
              color: "#0857d0",
              mx: "16px",
            },
          }}
        />
      </div>
    </div>
  );
}

export default RentalHomesList;
