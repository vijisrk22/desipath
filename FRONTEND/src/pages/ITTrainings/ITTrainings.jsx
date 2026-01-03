import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SearchButton from "../../components/SearchButton";

import ITLearningPaths from "../../components/ITTrainings/ITLearningPaths";
import SearchResultsPage from "./SearchResultsPage";

function ITTrainings() {
  const { action } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target.searchQuery.value;
    navigate(
      `/services/itTrainings/searchResults?searchQuery=${encodeURIComponent(
        query
      )}`
    );
  };
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />

      {action === undefined && (
        <div>
          <div className="bg-sky-50 ">
            <div className="flex-grow px-[7%] py-16">
              <div className="mt-14 text-blue-700 text-5xl font-bold font-dmsans">
                IT Trainings
              </div>
              <div className="mt-5 max-w-screen-md text-cyan-700 text-3xl font-medium font-dmsans">
                Choose from hundreds of IT Trainers and Training companies.
              </div>
              <form
                onSubmit={handleSubmit}
                className="mt-[55px] bg-white rounded-[80px] max-w-xl flex gap-3 md:gap-10 items-center justify-between px-4 py-2"
              >
                <input
                  name="searchQuery"
                  placeholder="Search IT skills eg.. Java, Oracle, SAP, Business Analyst"
                  className="flex-1 outline-none ml-4"
                />
                <SearchButton textVisible={false} paddingClass="p-3.5" />
              </form>
            </div>
            {/* Courses */}
          </div>

          <ITLearningPaths />
          <div>
            <Footer newsletter={"block"} />
          </div>
        </div>
      )}

      {action === "searchResults" && <SearchResultsPage />}
    </div>
  );
}

export default ITTrainings;
