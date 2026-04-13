import { useSearchParams } from "react-router-dom";
import { postQuery } from "../../store/ITTrainingsSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import CourseCard from "./CourseCard";

import { Pagination } from "@mui/material";

function SearchResultsContent() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchQuery");
  const dispatch = useDispatch();
  const { loading, error, searchResults } = useSelector(
    (state) => state.itTrainings
  );

  const coursesPerPage = 4;
  const numsOfPage = Math.ceil(searchResults.length / coursesPerPage);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * coursesPerPage;
  const displayedCourses = searchResults.slice(
    startIndex,
    startIndex + coursesPerPage
  );

  // Set courses on mount
  useEffect(() => {
    if (searchQuery) {
      dispatch(postQuery({ query: searchQuery }));
    }
  }, [dispatch, searchQuery]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">Something went wrong: {error}</div>;
  }

  return (
    <div className="mt-12 mb-20">
      <div className="mb-8">
        <div className="text-[#007185] text-[32px] md:text-[40px] font-bold font-dmsans">
          Recommended Courses
        </div>
        <div className="text-gray-500 text-base font-medium font-dmsans mt-2">
          Found {searchResults.length} results for "<span className="text-[#007185] font-bold">{searchQuery}</span>"
        </div>
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {displayedCourses.map((result) => (
            <CourseCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500 text-xl font-medium">
          No courses found matching your query.
        </div>
      )}

      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {startIndex + 1}-{Math.min(startIndex + coursesPerPage, searchResults.length)} of {searchResults.length} items
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

export default SearchResultsContent;
