import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

function SellCar() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell Cars", eP: "/services/cars" },
    { text: "Sell Car", eP: "/services/cars/sellCar" },
  ];

  return (
    <div className="bg-[#f3f5f7]">
      <div className="mb-20  h-auto">
        <ServiceTopBar title="Sell my Car" paths={paths} form="car" />
      </div>
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default SellCar;
