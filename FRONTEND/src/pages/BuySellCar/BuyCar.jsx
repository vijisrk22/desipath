import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Cars from "../../components/BuySellCar/Cars";
import ActiveCarSearchFilters from "../../components/BuySellCar/ActiveCarSearchFilters";

function BuyCar() {
  const inputs = ["location", "makeAndModel"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell Cars", eP: "/services/cars" },
    { text: "Buy Car", eP: "/services/cars/buyCar" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Buy a Car" paths={paths} />
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveCarSearchFilters />
        <a
          href="/services/cars/sellCar"
          className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-base font-bold font-dmsans whitespace-nowrap self-end md:self-auto mb-4 md:mb-0 shadow-sm"
        >
          Post a Car
        </a>
      </div>
      <Cars />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyCar;
