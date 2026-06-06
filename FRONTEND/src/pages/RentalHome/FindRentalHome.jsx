import Footer from "../../components/Footer/Footer";
import RentalHomeHeroSearch from "../../components/RentalHome/RentalHomeHeroSearch";

import RentalHomesList from "../../components/RentalHome/RentalHomesList";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { resetSearchState } from "../../store/RentalHomesSlice";
import LocationSelectorModal from "../../components/LocationSelectorModal";

function FindRentalHome() {
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    dispatch(resetSearchState());
    
    // Check if location exists
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setCurrentLocation(savedLocation);
    }
  }, [dispatch]);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setCurrentLocation(locationString);
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
      <RentalHomeHeroSearch location={currentLocation} />
      <RentalHomesList />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRentalHome;
