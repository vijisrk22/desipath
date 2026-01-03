import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Cars from "../../components/BuySellCar/Cars";

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
      <Cars />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyCar;
