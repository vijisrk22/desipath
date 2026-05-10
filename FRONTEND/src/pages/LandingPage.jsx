import { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "../components/Navbar/Navbar";
import SearchAndFilter from "../components/SearchAndFilter";
import Services from "../components/Services";
import Footer from "../components/Footer/Footer";
import LocationSelectorModal from "../components/LocationSelectorModal";
import LazySection from "../components/LazySection";
import { CircularProgress } from "@mui/material";

// Lazy load carousels to reduce initial bundle size
const KidsClassCarousel = lazy(() => import("../components/KidsClass/KidsClassCarousel"));
const TravelCompanionCarousel = lazy(() => import("../components/TravelCompanionCarousel"));
const Events = lazy(() => import("../components/Events"));
const Homes = lazy(() => import("../components/Homes"));
const RentalHomesCarousel = lazy(() => import("../components/RentalHomesCarousel"));

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
    console.log("LandingPage handleLocationSelect received:", locationString);
    localStorage.setItem('user_location', locationString);
    setCurrentLocation(locationString);
    setShowLocationModal(false);
  };

  const LoadingFallback = () => (
    <div className="flex justify-center items-center py-12">
      <CircularProgress size={30} />
    </div>
  );

  const handleClearLocation = () => {
    localStorage.removeItem('user_location');
    setCurrentLocation("");
  };

  return (
    <main>
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
          onClearLocation={handleClearLocation}
        />
      </div>
      <div className="px-4 md:px-[7%] lg:px-[108px]">
        <div className="mt-[20px] md:mt-[30px] pb-[30px]">
          <Services />
        </div>
        
        <Suspense fallback={<LoadingFallback />}>
          <div className="mt-[50px] pb-[30px]">
            <Events />
          </div>
          
          <LazySection height="350px">
            <div className="mt-[50px] pb-[30px]">
              <TravelCompanionCarousel />
            </div>
          </LazySection>

          <LazySection height="400px">
            <div className="mt-[50px] pb-[30px]">
              <Homes />
            </div>
          </LazySection>

          <LazySection height="400px">
            <div className="mt-[50px] pb-[30px]">
              <RentalHomesCarousel />
            </div>
          </LazySection>

          <LazySection height="400px">
            <div className="mt-[50px] pb-[30px]">
              <KidsClassCarousel />
            </div>
          </LazySection>
        </Suspense>
      </div>

      <div className="mt-[81px]">
        <Footer newsletter={"block"} hideOnMobile />
      </div>
    </main>
  );
}

export default LandingPage;
