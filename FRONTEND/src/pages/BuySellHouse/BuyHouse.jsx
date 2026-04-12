import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Houses from "../../components/BuySellHouse/Houses";

import ActiveHouseSearchFilters from "../../components/BuySellHouse/ActiveHouseSearchFilters";

function BuyHouse() {
  const inputs = ["Location", "Zip Code"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell House", eP: "/services/houses" },
    { text: "Buy a House", eP: "/services/houses/buyHouse" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Buy a home" paths={paths} />
      <div className="flex justify-end px-20 pt-5">
        <a
          href="/services/houses/sellHouse"
          className="px-5 py-2.5 bg-[#ffa41c] rounded-[57px] text-gray-800 text-base font-bold font-dmsans"
        >
          Post a House
        </a>
      </div>
      <ActiveHouseSearchFilters />
      <Houses />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyHouse;
