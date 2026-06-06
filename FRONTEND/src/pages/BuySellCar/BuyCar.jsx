import React, { useState, useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import BuyCarHero from "../../components/BuySellCar/BuyCarHero";
import Cars from "../../components/BuySellCar/Cars";
import LocationSelectorModal from "../../components/LocationSelectorModal";
import { useDispatch } from "react-redux";

function BuyCar() {
  const dispatch = useDispatch();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
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
      <BuyCarHero location={currentLocation} />
      <Cars />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyCar;
