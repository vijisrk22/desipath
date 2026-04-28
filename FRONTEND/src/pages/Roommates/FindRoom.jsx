import Footer from "../../components/Footer/Footer";
import ServiceTopBar from "../../components/ServiceTopBar";

import Rooms from "../../components/Roommates/Rooms";
import ActiveRoomSearchFilters from "../../components/Roommates/ActiveRoomSearchFilters";

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
      <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center px-[7%] pt-6">
        <ActiveRoomSearchFilters />
      </div>
      <Rooms />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRoom;
