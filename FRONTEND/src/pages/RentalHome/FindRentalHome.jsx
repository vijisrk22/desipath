import Footer from "../../components/Footer/Footer";
import RentalHomeHeroSearch from "../../components/RentalHome/RentalHomeHeroSearch";

import RentalHomesList from "../../components/RentalHome/RentalHomesList";
import ActiveSearchFilters from "../../components/RentalHome/ActiveSearchFilters";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetSearchState } from "../../store/RentalHomesSlice";
import LocationSelectorModal from "../../components/LocationSelectorModal";

function FindRentalHome() {
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);

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
  };

  return (
    <div className="bg-[#f3f5f7]">
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />
      <RentalHomeHeroSearch />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveSearchFilters />
      </div>
      <RentalHomesList />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRentalHome;
