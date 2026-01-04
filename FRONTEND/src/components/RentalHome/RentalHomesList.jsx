import { Pagination } from "@mui/material";
import RentalHomeCard from "./RentalHomeCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { fetchRentalHomes } from "../../store/RentalHomesSlice";

function RentalHomesList() {
  // backend API endpoint /api/rooms
  // State for events
  const dispatch = useDispatch();
  const { loading, error, rentalHomes, pagination } = useSelector(
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
    dispatch(fetchRentalHomes({ page, sortOption }));
  }, [dispatch, page, sortOption]);

  const numsOfPage = pagination?.last_page || 1;

  if (loading) {
    return <Loader />;
  }
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
        {rentalHomes.map((rentalHome, index) => {
          return <RentalHomeCard key={index} rentalHome={rentalHome} />;
        })}
      </div>

      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {pagination?.current_page}-{numsOfPage.toString().padStart(2, "0")} of{" "}
          {pagination?.total} items
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

export default RentalHomesList;
