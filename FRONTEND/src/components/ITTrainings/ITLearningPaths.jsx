import { Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";

import { fetchLearningPaths } from "../../store/ITTrainingsSlice";
import LearningPathCard from "./LearnPathCard";

function ITLearningPaths() {
  const dispatch = useDispatch();
  const { loading, error, learningPaths } = useSelector(
    (state) => state.itTrainings
  );

  const learningPathsPerPage = 8;
  const numsOfPage = Math.ceil(learningPaths.length / learningPathsPerPage);
  const [page, setPage] = useState(1);
  const startIndex = (page - 1) * learningPathsPerPage;
  const displayedLearningPaths = learningPaths.slice(
    startIndex,
    startIndex + learningPathsPerPage
  );

  //Get learningPaths on mount
  useEffect(() => {
    dispatch(fetchLearningPaths());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-[7%] py-16">
      <div className="mb-10">
        <div className="text-[#007185] text-3xl md:text-4xl font-bold font-dmsans">
          Explore Learning Paths
        </div>
        <div className="text-gray-500 text-lg font-medium font-dmsans mt-2">
          Specialized curriculum to accelerate your career.
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {displayedLearningPaths?.map((learningPath, index) => (
          <LearningPathCard key={learningPath.id} learningPath={learningPath} />
        ))}
      </div>
      <div className="mx-auto flex flex-col md:flex-row justify-between gap-6 items-center mt-16 px-8 py-6 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-[#323232] text-sm font-medium font-dmsans">
          Showing {startIndex + 1}-{Math.min(startIndex + learningPathsPerPage, learningPaths.length)} of {learningPaths.length} paths
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

export default ITLearningPaths;
