import { useParams } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";
import ServiceHeroSection from "../../components/ServiceHeroSection";

import BuyCar from "./BuyCar";
import SellCar from "./SellCar";
import PostConfirmation from "../PostConfirmation";

function BuySellCar() {
  const { action } = useParams();

  const pageDetails = {
    path1: "buyCar",
    path2: "sellCar",
    description1: "Search and Buy Cars in your area",
    description2: "Sell My Car, Post An Ad",
    buttonText1: "Buy Cars",
    buttonText2: "Sell My Car",
  };

  return (
    <div className="flex flex-col min-h-screen overflow-y-auto ">
      <Navbar />

      {action === undefined && (
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
      )}

      {action === "buyCar" && <BuyCar />}
      {action === "sellCar" && <SellCar />}
      {action === "postConfirmation" && <PostConfirmation />}
    </div>
  );
}

export default BuySellCar;
