import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Houses from "../../components/BuySellHouse/Houses";

import ActiveHouseSearchFilters from "../../components/BuySellHouse/ActiveHouseSearchFilters";

function BuyHouse() {
  const inputs = ["location"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell House", eP: "/services/houses" },
    { text: "Buy a House", eP: "/services/houses/buyHouse" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Buy a home" paths={paths} />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveHouseSearchFilters />
        <a
          href="/services/houses/sellHouse"
          className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-base font-bold font-dmsans whitespace-nowrap self-end md:self-auto mb-4 md:mb-0 shadow-sm"
        >
          Post a House
        </a>
      </div>
      <Houses />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyHouse;
