import Footer from "../../components/Footer/Footer";
import BuyRoomHero from "../../components/Roommates/BuyRoomHero";
import Rooms from "../../components/Roommates/Rooms";

function FindRoom() {
  return (
    <div className="bg-[#f3f5f7]">
      <BuyRoomHero />
      <Rooms />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRoom;
