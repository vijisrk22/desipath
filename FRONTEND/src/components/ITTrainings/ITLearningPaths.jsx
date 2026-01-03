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
    <div className="flex px-[7%] py-16 flex-wrap gap-4 justify-center items-center  ">
      {displayedLearningPaths?.map((learningPath, index) => (
        <LearningPathCard key={learningPath.id} learningPath={learningPath} />
      ))}
      <div className="max-w-screen-lg mx-auto flex justify-between gap-12 items-center my-10 px-6 py-3 bg-white">
        <div className="text-[#323232] text-sm font-normal font-dmsans">
          {page}-{numsOfPage.toString().padStart(2, "0")} of{" "}
          {learningPaths.length} items
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
