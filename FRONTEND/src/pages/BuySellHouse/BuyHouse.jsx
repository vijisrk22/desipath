import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Houses from "../../components/BuySellHouse/Houses";

import ActiveHouseSearchFilters from "../../components/BuySellHouse/ActiveHouseSearchFilters";

function BuyHouse() {
  const inputs = ["location", "homeType"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell House", eP: "/services/BuyHome" },
    { text: "Buy a House", eP: "/services/BuyHome/find" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Buy a home" paths={paths} />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveHouseSearchFilters />
      </div>
      <Houses />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyHouse;
