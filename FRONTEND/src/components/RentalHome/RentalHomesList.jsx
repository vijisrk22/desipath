import { Pagination } from "@mui/material";
import RentalHomeCard from "./RentalHomeCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import SortBy from "../SortBy";

import { searchRentalHome, fetchRentalHomes } from "../../store/RentalHomesSlice";

function RentalHomesList() {
  const dispatch = useDispatch();
  const { loading, error, rentalHomes, pagination, lastSearchQuery } = useSelector(
    (state) => state.rentalHomes
  );

  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("created_at-desc");

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    
    if (lastSearchQuery) {
      dispatch(searchRentalHome({ searchQuery: lastSearchQuery, page, sortOption }));
    } else if (!savedLocation) {
      dispatch(fetchRentalHomes({ page, sortOption }));
    }
  }, [dispatch, page, sortOption]);

  const numsOfPage = pagination?.last_page || 1;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-[7%] mt-6 mb-20">
      <div className="mb-8 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-100/50">
        <div className="text-[#007185] text-[16px] md:text-[20px] font-bold font-dmsans uppercase tracking-wide">
          Rental Listings
        </div>
        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1);
          }}
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-4 mb-8 rounded-2xl text-center font-medium shadow-sm border border-red-200">
          <span className="mr-2">⚠️</span>
          {typeof error === 'object' ? (error.message || JSON.stringify(error)) : String(error || "Unknown error")}
        </div>
      )}

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
              mx: "12px",
            },
            "& .MuiPaginationItem-page.Mui-selected": {
              backgroundColor: "#0857d0",
              color: "white",
            },
            "& .MuiPaginationItem-ellipsis": {
              color: "#0857d0",
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
