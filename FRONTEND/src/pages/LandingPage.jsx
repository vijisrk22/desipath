
import Chat from "../components/Chat/Chat";
import Events from "../components/Events";
import Footer from "../components/Footer/Footer";
import Homes from "../components/Homes";
import RentalHomesCarousel from "../components/RentalHomesCarousel";
import Navbar from "../components/Navbar/Navbar";
import SearchAndFilter from "../components/SearchAndFilter";
import Services from "../components/Services";

import { useState, useEffect } from "react";
import LocationSelectorModal from "../components/LocationSelectorModal";

function LandingPage() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("");

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
    } else {
      setCurrentLocation(savedLocation);
    }
  }, []);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setCurrentLocation(locationString);
    setShowLocationModal(false);
  };

  return (
    <div>
      <Navbar />
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />

      <div className="flex justify-center">
        <SearchAndFilter 
          initialLocation={currentLocation} 
          onEditLocation={() => setShowLocationModal(true)}
        />
      </div>
      <div className="px-4 md:px-[7%] lg:px-[108px]">
        <div className="mt-[20px] md:mt-[30px] pb-[30px]">
          <Services />
        </div>
        <div className="mt-[50px] pb-[30px]">
          <Events />
        </div>
        <div className="mt-[50px] pb-[30px]">
          <Homes />
        </div>
        <div className="mt-[50px] pb-[30px]">
          <RentalHomesCarousel />
        </div>
      </div>



      <div className="mt-[81px]">
        <Footer newsletter={"block"} hideOnMobile />
      </div>
    </div>
  );
}

export default LandingPage;
