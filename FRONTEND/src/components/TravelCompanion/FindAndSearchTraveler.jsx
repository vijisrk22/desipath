import CompanionSearchBar from "./CompanionSearchBar";
import { fetchTravelers } from "../../store/TravelCompanionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../Loader";
import CompanionHeroCard from "./CompanionHeroCard";

function FindAndSearchTraveler() {
  const dispatch = useDispatch();
  const { loading, error, travelers } = useSelector(
    (state) => state.travelCompanion
  );

  //Get travelCompanions on mount
  useEffect(() => {
    dispatch(fetchTravelers());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-6 py-4 md:py-6 max-w-screen-lg mx-auto flex flex-col gap-y-4">
      <CompanionSearchBar />

      <div className="flex flex-col gap-y-4 md:gap-y-6 my-11">
        {travelers.length > 0 ? (
          travelers.map((traveler, index) => (
            <CompanionHeroCard key={traveler.id} personType={traveler} />
          ))
        ) : (
          <div className="text-center text-gray-500">No travelers found</div>
        )}
      </div>
    </div>
  );
}

export default FindAndSearchTraveler;
