import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import BuyCar from "./BuyCar";
import SellCar from "./SellCar";
import PostConfirmation from "../PostConfirmation";
import CarDetails from "./CarDetails";
import { useState } from "react";
import LocationSelectorModal from "../../components/LocationSelectorModal";

function BuySellCar() {
  const { action, carId } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const savedLocation = localStorage.getItem('user_location');
    if (!savedLocation) {
      setShowLocationModal(true);
    }
  }, []);

  const handleLocationSelect = (locationString) => {
    localStorage.setItem('user_location', locationString);
    setShowLocationModal(false);
  };

  if ((action === "sellCar" || action === "edit") && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action, carId]);

  const pageDetails = {
    path1: "buyCar",
    path2: "sellCar",
    description1: "Search and Buy Cars in your area",
    description2: "Sell My Car, Post An Ad",
    buttonText1: "Buy Cars",
    buttonText2: "Sell My Car",
  };

  const showNavbar = true;

  // Decision logic for which component to render
  const renderContent = () => {
    // 1. Form actions take absolute priority
    if (action === "edit" || action === "sellCar") return <SellCar />;

    // 2. Specific Item View takes second priority (handles buyCar/:carId or just /:carId)
    if (carId) return <CarDetails />;

    // 3. General action pages
    if (action === "buyCar") return <BuyCar />;
    if (action === "postConfirmation") {
      return (
        <PostConfirmation
          redirectTo="/services/cars/buyCar"
          message="Thanks for using Desipath. Your car listing is live!"
          bgImg="/img/cars/backgroundCarImg.png"
          paths={[
            { text: "Home", eP: "/" },
            { text: "Buy/Sell Cars", eP: "/services/cars" },
            { text: "Confirmation", eP: "" },
          ]}
        />
      );
    }
    
    if (action === undefined) {
      return (
        <>
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection
              pageDetails={pageDetails}
              bgImg={"/img/cars/buy_sell_cars_hero.png"}
              orangeArrow={true}
            />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      );
    }

    // Default to details if nothing else matches
    return <CarDetails />;
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      {showNavbar && <Navbar />}
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />
      {renderContent()}
    </div>
  );
}

export default BuySellCar;
