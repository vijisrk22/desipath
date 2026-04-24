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

  const pageDetails = {
    path1: "buyHouse",
    path2: "sellHouse",
    description1: "Search for a house to buy in your area",
    description2: "Post an ad to sell your house",
    buttonText1: "Homes To Buy",
    buttonText2: "Post An Ad/Sale My Home",
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
              bgImg="/img/houses/house1.png" 
            />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "buyHouse" ? (
        <BuyHouse />
      ) : (action === "sellHouse" || action === "edit") ? (
        <SellHouse />
      ) : action === "postConfirmation" ? (
        <PostConfirmation 
          redirectTo="/services/houses/buyHouse" 
          message="Thanks for using Desipath. Your house listing is live!" 
        />
      ) : (
        <HouseDetails />
      )}
    </div>
  );
}

export default BuySellHouse;
