import CompanionSearchBar from "./CompanionSearchBar";
import { fetchTravelCompanions } from "../../store/TravelCompanionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../Loader";
import CompanionHeroCard from "./CompanionHeroCard";

function FindAndSearchCompanion() {
  const dispatch = useDispatch();
  const { loading, error, travelCompanions } = useSelector(
    (state) => state.travelCompanion
  );

  //Get travelCompanions on mount
  useEffect(() => {
    dispatch(fetchTravelCompanions());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-6 py-4 md:py-6 max-w-screen-lg mx-auto flex flex-col gap-y-4">
      <CompanionSearchBar />

      <div className="flex flex-col gap-y-4 md:gap-y-6 my-11">
        {travelCompanions.length > 0 ? (
          travelCompanions.map((companion, index) => (
            <CompanionHeroCard key={companion.id} personType={companion} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No travel companions found
          </div>
        )}
      </div>
    </div>
  );
}

export default FindAndSearchCompanion;
