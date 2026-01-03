import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import BuyHouse from "./BuyHouse";
import SellHouse from "./SellHouse";
import PostConfirmation from "../PostConfirmation";

function BuySellHouse() {
  const { action } = useParams();

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

      {action === undefined && (
        <>
          {" "}
          <div className="flex-grow bg-[#f0f8ff]">
            <ServiceHeroSection pageDetails={pageDetails} />
          </div>
          <div className="bg-[#f0f8ff]">
            <Footer newsletter={"block"} />
          </div>
        </>
      )}

      {action === "buyHouse" && <BuyHouse />}
      {action === "sellHouse" && <SellHouse />}
      {action === "postConfirmation" && <PostConfirmation />}
    </div>
  );
}

export default BuySellHouse;
