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
    <div className="py-6 max-w-7xl mx-auto flex flex-col gap-y-12 mb-20 px-[7%]">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <CompanionSearchBar />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
        {travelCompanions.length > 0 ? (
          travelCompanions.map((companion, index) => (
            <CompanionHeroCard key={companion.id} personType={companion} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-xl font-medium">
            No travel companions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default FindAndSearchCompanion;
