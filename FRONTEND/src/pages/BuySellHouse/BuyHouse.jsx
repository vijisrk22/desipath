import Footer from "../../components/Footer/Footer";
import Houses from "../../components/BuySellHouse/Houses";
import BuyHouseHero from "../../components/BuySellHouse/BuyHouseHero";
import BuyerResources from "../../components/BuySellHouse/BuyerResources";
import SellHomeCTA from "../../components/BuySellHouse/SellHomeCTA";

function BuyHouse() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <BuyHouseHero />
      
      {/* New Listings Section */}
      <div className="w-full mx-auto">
        <Houses />
      </div>
      <BuyerResources />
      <SellHomeCTA />

      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyHouse;
