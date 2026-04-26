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

function BuySellCar() {
  const { action } = useParams();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  if ((action === "sellCar" || action === "edit") && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action]);

  const pageDetails = {
    path1: "buyCar",
    path2: "sellCar",
    description1: "Search and Buy Cars in your area",
    description2: "Sell My Car, Post An Ad",
    buttonText1: "Buy Cars",
    buttonText2: "Sell My Car",
  };

  const showNavbar = true;

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      {showNavbar && <Navbar />}

      {action === undefined ? (
        <>
          {" "}
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection
              pageDetails={pageDetails}
              bgImg={"/img/cars/backgroundCarImg.png"}
            />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "buyCar" ? (
        <BuyCar />
      ) : (action === "sellCar" || action === "edit") ? (
        <SellCar />
      ) : action === "postConfirmation" ? (
        <PostConfirmation
          redirectTo="/services/cars/buyCar"
          message="Thanks for using Desipath. Your car listing is live!"
        />
      ) : (
        <CarDetails />
      )}
    </div>
  );
}

export default BuySellCar;
