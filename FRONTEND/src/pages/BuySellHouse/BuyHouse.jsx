import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Houses from "../../components/BuySellHouse/Houses";

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
      <Houses />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyHouse;
