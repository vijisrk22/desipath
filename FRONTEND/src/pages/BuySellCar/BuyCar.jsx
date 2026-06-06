import Footer from "../../components/Footer/Footer";
import BuyCarHero from "../../components/BuySellCar/BuyCarHero";
import Cars from "../../components/BuySellCar/Cars";

function BuyCar() {
  return (
    <div className="bg-[#f3f5f7]">
      <BuyCarHero />
      <Cars />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default BuyCar;
