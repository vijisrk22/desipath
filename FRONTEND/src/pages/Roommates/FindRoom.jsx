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
        <a
          href="/services/roommates/postRoom"
          className="px-6 py-2.5 bg-[#ffa41c] hover:bg-[#ff9900] transition-colors rounded-[57px] text-gray-800 text-base font-bold font-dmsans whitespace-nowrap self-end md:self-auto mb-4 md:mb-0 shadow-sm"
        >
          Post a Room
        </a>
      </div>
      <Rooms />
      <Footer bgColor="bg-white" />
    </div>
  );
}

export default FindRoom;
