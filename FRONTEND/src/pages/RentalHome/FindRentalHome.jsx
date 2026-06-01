import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import RentalHomesList from "../../components/RentalHome/RentalHomesList";
import ActiveSearchFilters from "../../components/RentalHome/ActiveSearchFilters";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetSearchState } from "../../store/RentalHomesSlice";
import LocationSelectorModal from "../../components/LocationSelectorModal";

function FindRentalHome() {
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    dispatch(resetSearchState());
    
    // Check if location exists
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
    }
  }, [dispatch]);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setShowLocationModal(false);
    // Force a re-render of SearchFieldInput via a key change if needed, 
    // or simply rely on the fact that we've set localStorage.
    // Since SearchFieldInput has its own mount effect, we might need to trigger it.
    setRefreshKey(prev => prev + 1);
  };

  const inputs = ["location", "type"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Rental Home", eP: "/services/rentalhomes" },
    { text: "Find Rental Home", eP: "/services/rentalhomes/findRentalHome" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />
      <ServiceTopBar key={refreshKey} inputs={inputs} title="Rent a Home" paths={paths} />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveSearchFilters />
      </div>
      <RentalHomesList />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRentalHome;
