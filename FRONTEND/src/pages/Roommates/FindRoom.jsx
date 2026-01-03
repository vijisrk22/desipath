import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Rooms from "../../components/Roommates/Rooms";

function FindRoom() {
  const inputs = ["location"];
  const paths = [
    { text: "Home", eP: "/" },
    { text: "Roommates", eP: "/services/roommates" },
    { text: "Find a Room", eP: "/services/roommates/findRoom" },
  ];
  return (
    <div className="bg-[#f3f5f7]">
      <ServiceTopBar inputs={inputs} title="Find a Room" paths={paths} />
      <Rooms />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRoom;
