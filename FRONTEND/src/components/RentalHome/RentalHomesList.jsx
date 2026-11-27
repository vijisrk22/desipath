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
  const totalCount = pagination?.total ?? rentalHomes?.length ?? 0;

  return (
    <div id="rental-results" className="px-[7%] mt-6 mb-20 scroll-mt-20 md:scroll-mt-24">
      <div className="mb-8 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-gray-100/50">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-[#007185] text-[18px] md:text-[22px] font-bold font-dmsans uppercase tracking-wide">
              Rental Listings
            </h2>
            <span className="bg-blue-50 text-[#0857D0] border border-blue-200 px-3 py-0.5 rounded-full text-xs md:text-sm font-bold font-dmsans shadow-sm">
              {totalCount} {totalCount === 1 ? 'Result Found' : 'Results Found'}
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm font-medium font-dmsans mt-1">
            {loading
              ? 'Searching properties...'
              : totalCount > 0
              ? `Showing properties matching your search criteria`
              : 'No rental properties match your search criteria'}
          </p>
        </div>

        <SortBy
          sortOption={sortOption}
          setSortOption={(value) => {
            setSortOption(value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="py-12">
          <Loader />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default RentalHomesList;
