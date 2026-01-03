import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

function SellHouse() {
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Buy/Sell House", eP: "/services/houses" },
    { text: "Sell a House", eP: "/services/houses/sellHouse" },
  ];

  return (
    <div className="bg-[#f3f5f7]">
      <div className="mb-20  h-auto">
        <ServiceTopBar
          title="Sell my Home, Post an Ad"
          paths={paths}
          form="house"
        />
      </div>

      <Footer bgColor="bg-white" />
    </div>
  );
}

export default SellHouse;
