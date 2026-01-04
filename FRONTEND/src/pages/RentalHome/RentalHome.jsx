import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import FindRentalHome from "./FindRentalHome";
import PostRentalHome from "./PostRentalHome";
import PostConfirmation from "../PostConfirmation";
import RentalHomeDetails from "./RentalHomeDetails";
import { useEffect } from "react";

function RentalHome() {
  const { action } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [action]);

  const pageDetails = {
    path1: "findRentalHome",
    path2: "postRentalHome",
    description1: "Find a home for Rent",
    description2: "Want To Rent Out Your Home, Post An Ad Today - Free Listing",
    buttonText1: "Search for Rental Home",
    buttonText2: "Post an Ad to Rent My Home",
  };

  const showNavbar =
    action === undefined ||
    action === "findRentalHome" ||
    action === "postRentalHome" ||
    action === "postConfirmation";

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto" style={{ cursor: 'default' }}>
      {showNavbar && <Navbar />}

      {action === undefined ? (
        <>
          {" "}
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection pageDetails={pageDetails} bgImg="/rentalHomeHero.png" />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      ) : action === "findRentalHome" ? (
        <FindRentalHome />
      ) : action === "postRentalHome" ? (
        <PostRentalHome />
      ) : action === "postConfirmation" ? (
        <PostConfirmation />
      ) : (
        <RentalHomeDetails />
      )}
    </div>
  );
}

export default RentalHome;
