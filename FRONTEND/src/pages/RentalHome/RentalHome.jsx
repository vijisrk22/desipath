import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import RentalHomeHero from "./RentalHomeHero";

import FindRentalHome from "./FindRentalHome";
import PostRentalHome from "./PostRentalHome";
import PostConfirmation from "../PostConfirmation";
import RentalHomeDetails from "./RentalHomeDetails";
import { useEffect, useState } from "react";
import LocationSelectorModal from "../../components/LocationSelectorModal";

function RentalHome() {
  const { action } = useParams();
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

  if ((action === "postRentalHome" || action === "edit") && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action]);

  const showNavbar = true;

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto" style={{ cursor: 'default' }}>
      {showNavbar && <Navbar />}
      
      <LocationSelectorModal 
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectLocation={handleLocationSelect}
        onShowAll={() => setShowLocationModal(false)}
      />

      {action === undefined ? (
        <>
          <div className="flex-grow bg-[#f0f8ff]">
            <RentalHomeHero />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "findRentalHome" ? (
        <FindRentalHome />
      ) : (action === "postRentalHome" || action === "edit") ? (
        <PostRentalHome />
      ) : action === "postConfirmation" ? (
        <PostConfirmation 
          redirectTo="/services/rentalhomes/findRentalHome" 
          message="Thanks for using Desipath. Your rental home listing is live!" 
        />
      ) : (
        <RentalHomeDetails />
      )}
    </div>
  );
}

export default RentalHome;
