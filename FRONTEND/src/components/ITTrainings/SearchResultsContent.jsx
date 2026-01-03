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
    <div className="my-3.5">
      <div className="text-cyan-700 text-3xl font-medium font-dmsans">
        Choose from hundreds of IT Trainers and Training companies.
      </div>
      <p>
        Here are the search results for your query{" "}
        <span className="font-semibold">{searchQuery}</span>.
      </p>

      {searchResults && searchResults.length > 0 ? (
        <ul className="mt-4 space-y-20">
          {displayedCourses.map((result) => (
            <CourseCard key={result.id} result={result} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No results found.</p>
      )}

      <div className="max-w-screen-lg mx-auto flex justify-around gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of{" "}
          {searchResults.length} items
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
