import Footer from "../../components/Footer/Footer";
import DisplayPath from "../../components/DisplayPath";
import SearchResultsContent from "../../components/ITTrainings/SearchResultsContent";
import { useSearchParams } from "react-router-dom";

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("searchQuery");

  const paths = [
    { text: "Home", eP: "/" },
    { text: "IT Trainings", eP: "/services/itTrainings" },
    {
      text: "Search Results",
      eP: `/services/itTrainings/searchResults?searchQuery=${encodeURIComponent(
        searchQuery
      )}`,
    },
  ];

  return (
    <>
      <div className="px-[7%] min-h-screen">
        <DisplayPath
          paths={paths}
          color="gray-500"
          additionalStyles="leading-tight"
        />
        <SearchResultsContent />
      </div>
      <Footer bgColor="bg-white" />
    </>
  );
}

export default SearchResultsPage;
