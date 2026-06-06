import { useParams, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import BuyHouse from "./BuyHouse";
import SellHouse from "./SellHouse";
import PostConfirmation from "../PostConfirmation";
import HouseDetails from "./HouseDetails";
function BuySellHouse() {
  const { action } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  if ((action === "sellHouse" || action === "edit") && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action]);

  if (action === "buyHouse" || action === "buyHome") {
    return <Navigate to="/services/BuyHome/find" replace />;
  }

  const pageDetails = {
    path1: "find",
    path2: "sellHouse",
    description1: "Find Your Dream Home",
    description2: "Ready to Sell Your Home?",
    buttonText1: "Search Homes for Sale",
    buttonText2: "List Your Home for Sale",
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />

      {action === undefined ? (
        <>
          {" "}
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection 
              pageDetails={pageDetails} 
              bgImg="/img/houses/Desipath_BuysellHomes.png" 
              orangeArrow={true}
            />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "find" ? (
        <BuyHouse />
      ) : (action === "sellHouse" || action === "edit") ? (
        <SellHouse />
      ) : action === "postConfirmation" ? (
        <PostConfirmation 
          redirectTo="/services/BuyHome/find" 
          message="Thanks for using Desipath. Your house listing is live!" 
        />
      ) : (
        <HouseDetails />
      )}
    </div>
  );
}

export default BuySellHouse;
